import { useCallback, useEffect, useState } from "react";

type Coords = {
  lat: number;
  lng: number;
  accuracy: number;
};

type Location = {
  coords: Coords | null;
  error?: string;
  loading: boolean;
};

type Props = {
  watch?: boolean;
  options?: PositionOptions;
};

export default function useGeolocation({
  watch = false,
  options,
}: Props = {}): Location {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const onSuccess = ({ coords }: GeolocationPosition) => {
    setCoords({
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy,
    });
    setError(undefined);
    setLoading(false);
  };

  const onError = (err: GeolocationPositionError) => {
    setCoords(null);
    setError(
      "Autorize o acesso à sua localização nas configurações do navegador."
    );
    console.error(err.message);
    setLoading(false);
  };

  const requestOnce = useCallback(async (opts: PositionOptions) => {
    setLoading(true);
    setError(undefined);
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      setLoading(false);
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permission.state === "denied") {
        setError(
          "Autorize o acesso à sua localização nas configurações do navegador."
        );
        setLoading(false);
        return;
      }

      permission.onchange = () => {
        if (permission.state === "granted" || permission.state === "prompt") {
          requestOnce(opts);
        }
      };
    } catch (err) {
      console.error("Error checking geolocation permission:", err);
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
  }, []);

  useEffect(() => {
    let watchId: number | null = null;
    const opts = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000,
      ...options,
    };

    if (watch) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, opts);
      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } else {
      requestOnce(opts);
    }
  }, [watch, options, requestOnce]);

  return {
    coords: coords || null,
    error,
    loading,
  };
}

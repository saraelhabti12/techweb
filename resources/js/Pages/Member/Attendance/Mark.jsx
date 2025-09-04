import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function MarkAttendance({ auth, userName, token, hasArrival, hasDeparture }) {
  const { flash } = usePage().props;
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = async () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return null;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      setLocation(newLocation);
      return newLocation;
    } catch (error) {
      setLocationError("Unable to retrieve your location: " + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleMark = async (type) => {
    setIsLoading(true);
    try {
      // Use existing location or get new one
      const currentLocation = location || await getLocation();

      if (!currentLocation) {
        setLocationError("Location is required to mark attendance");
        return;
      }

      await router.post(`/attendance/mark/${token}`, {
        type,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      });

    } catch (error) {
      console.error('Error marking attendance:', error);
      setLocationError(error.message || "Failed to mark attendance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MemberLayout auth={auth}>
      <div className="max-w-md mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Hi, {userName}</h1>

        {flash?.error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {flash.error}
          </div>
        )}

        {locationError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {locationError}
          </div>
        )}

        {location && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800">
            Location captured: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={getLocation}
            disabled={isLoading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isLoading ? 'Getting Location...' : 'Get My Location'}
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleMark('arrival')}
            disabled={isLoading || hasArrival || !location}
            className={`px-5 py-2 rounded text-white disabled:opacity-50 ${
              hasArrival
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {hasArrival ? 'Arrival Marked' : 'Mark Arrival'}
          </button>

          <button
            onClick={() => handleMark('departure')}
            disabled={isLoading || hasDeparture || !hasArrival || !location}
            className={`px-5 py-2 rounded text-white disabled:opacity-50 ${
              hasDeparture
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {hasDeparture ? 'Departure Marked' : 'Mark Departure'}
          </button>
        </div>
      </div>
    </MemberLayout>
  );
}

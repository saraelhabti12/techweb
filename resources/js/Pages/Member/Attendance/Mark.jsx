import React, { useState } from 'react';
import { router, usePage, Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { MapPin, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

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
      const currentLocation = location || await getLocation();

      if (!currentLocation) {
        setLocationError("Location is required to mark attendance");
        return;
      }

      await router.post(route('member.attendance.mark', { token }), {
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
      <Head title="Mark Attendance" />
      
      <DashboardPage 
        title={`Welcome, ${userName}`} 
        description="Securely mark your arrival and departure using your current location."
      >
        <div className="max-w-md mx-auto">
          <DashboardCard className="p-8 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-[#1F2BF3]/10 flex items-center justify-center mx-auto mb-8 text-[#1F2BF3]">
              <MapPin className="w-10 h-10" />
            </div>

            {flash?.error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                {flash.error}
              </div>
            )}

            {locationError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                {locationError}
              </div>
            )}

            {location && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4" />
                Location Captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </div>
            )}

            <div className="space-y-4">
              {!location && (
                <DashboardButton
                  onClick={getLocation}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  <Navigation className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
                  {isLoading ? 'Detecting Location...' : 'Get My Location'}
                </DashboardButton>
              )}

              <div className="grid grid-cols-1 gap-4 pt-4">
                <DashboardButton
                  onClick={() => handleMark('arrival')}
                  disabled={isLoading || hasArrival || !location}
                  className="w-full"
                  variant={hasArrival ? 'secondary' : 'primary'}
                >
                  {hasArrival ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Arrival Marked
                    </div>
                  ) : 'Mark Arrival'}
                </DashboardButton>

                <DashboardButton
                  onClick={() => handleMark('departure')}
                  disabled={isLoading || hasDeparture || !hasArrival || !location}
                  className="w-full"
                  variant={hasDeparture ? 'secondary' : 'primary'}
                >
                  {hasDeparture ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Departure Marked
                    </div>
                  ) : 'Mark Departure'}
                </DashboardButton>
              </div>
              
              {!location && !isLoading && (
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6">
                  Click 'Get My Location' to enable check-in
                </p>
              )}
            </div>
          </DashboardCard>
        </div>
      </DashboardPage>
    </MemberLayout>
  );
}

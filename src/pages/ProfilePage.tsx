import { useState } from 'react';
// import { useForm } from 'react-hook-form';
import { Camera, User, MapPin, CreditCard, Bell, Shield } from 'lucide-react';
// import { useAuth } from '../features/auth/hooks/useAuth';
import LogoutButton from '../features/auth/components/LogoutButton';
// import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Removed unused type 'FormData'

const ProfilePage = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  // ...existing code...
  
  // Removed unused variable 'defaultValues'
  
  // ...existing code...
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // ...existing code...
  
  return (
    <div className="bg-gradient-to-br from-white/70 via-green-50/60 to-green-100/40 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">My Account</h1>
          <Tabs defaultValue="profile" className="mt-8">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Sidebar Navigation */}
              <div className="w-full sm:w-64 flex-shrink-0">
                <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl rounded-xl overflow-hidden border border-white/30">
                  <div className="p-6 text-center border-b border-white/30">
                    <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-green-100/60 via-white/40 to-green-200/40 overflow-hidden shadow-lg">
                      {avatar ? (
                        <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-green-50">
                          <User className="h-12 w-12 text-green-400" />
                        </div>
                      )}
                      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-50">
                        <Camera className="h-4 w-4 text-gray-600" />
                        <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                      </label>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">John Doe</h3>
                    <p className="text-sm text-gray-500">Member since June 2023</p>
                  </div>
                  <TabsList className="flex flex-col items-start p-0 rounded-none">
                    <TabsTrigger value="profile" className="w-full justify-start px-6 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-600 data-[state=active]:shadow-none">
                      <User className="mr-3 h-5 w-5" />
                      <span>Profile Information</span>
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="w-full justify-start px-6 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-600 data-[state=active]:shadow-none">
                      <MapPin className="mr-3 h-5 w-5" />
                      <span>Addresses</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="w-full justify-start px-6 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-600 data-[state=active]:shadow-none">
                      <CreditCard className="mr-3 h-5 w-5" />
                      <span>My Orders</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start px-6 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-600 data-[state=active]:shadow-none">
                      <Bell className="mr-3 h-5 w-5" />
                      <span>Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="w-full justify-start px-6 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-600 data-[state=active]:shadow-none">
                      <Shield className="mr-3 h-5 w-5" />
                      <span>Security</span>
                    </TabsTrigger>
                    <LogoutButton />
                  </TabsList>
                </div>
                <div className="mt-6 glass-card backdrop-blur-lg bg-gradient-to-r from-green-100/60 via-white/40 to-green-200/40 p-4 rounded-xl shadow">
                  <h4 className="text-sm font-medium text-green-800">Premium Member</h4>
                  <p className="mt-1 text-sm text-green-700">Enjoy free shipping on all orders and exclusive discounts.</p>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1">
                <TabsContent value="profile" className="mt-0">
                  <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl rounded-xl overflow-hidden">
                    ...existing code...
                  </div>
                </TabsContent>
                <TabsContent value="addresses" className="mt-0">
                  <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl rounded-xl overflow-hidden">
                    ...existing code...
                  </div>
                </TabsContent>
                <TabsContent value="orders" className="mt-0">
                  <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl rounded-xl overflow-hidden">
                    ...existing code...
                  </div>
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl rounded-xl overflow-hidden">
                    ...existing code...
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-0">
                  <div className="glass-card backdrop-blur-lg bg-gradient-to-br from-white/60 via-white/30 to-green-100/40 shadow-xl rounded-xl overflow-hidden">
                    ...existing code...
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

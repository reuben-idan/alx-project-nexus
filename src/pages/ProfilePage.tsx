import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';
import LogoutButton from '../features/auth/components/LogoutButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Removed unused type 'FormData'


const ProfilePage = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [notif] = useState<string[]>(['Welcome to Everything Grocery!']);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvatarError('Please upload a valid image file.');
        return;
      }
      setAvatarError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        // TODO: Save avatar to user profile backend
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit profile modal logic
  const openEdit = () => {
    setEditOpen(true);
    setEditError(null);
    setEditSuccess(false);
  };
  const closeEdit = () => {
    setEditOpen(false);
    setEditLoading(false);
    setEditError(null);
    setEditSuccess(false);
  };
  const saveEdit = async () => {
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    // Simulate async validation and save
    await new Promise(res => setTimeout(res, 1200));
    if (!editName.trim()) {
      setEditError('Full name is required.');
      setEditLoading(false);
      return;
    }
    if (!editEmail.trim() || !/^\S+@\S+\.\S+$/.test(editEmail)) {
      setEditError('Please enter a valid email address.');
      setEditLoading(false);
      return;
    }
    // TODO: Save to backend
    setEditLoading(false);
    setEditSuccess(true);
    setTimeout(() => {
      setEditOpen(false);
      setEditSuccess(false);
    }, 1200);
  };

  // Address management
  const addAddress = () => {
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress('');
    }
  };
  const removeAddress = (idx: number) => {
    setAddresses(addresses.filter((_, i) => i !== idx));
  };

  // Security
  const handlePasswordChange = () => {
    if (password.length >= 8) {
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 2000);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-glass-100 via-white/60 to-green-100/40 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Navigation */}
          <TabsList className="md:w-80 w-full flex-shrink-0 flex flex-col items-stretch p-0 rounded-none">
            <motion.div layout className="glass-card shadow-2xl rounded-3xl overflow-hidden border border-white/30 bg-gradient-to-br from-white/70 via-glass-100/60 to-green-100/40">
              <div className="p-8 text-center border-b border-white/30">
                <motion.div layout className="relative mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-green-100/60 via-white/40 to-green-200/40 overflow-hidden shadow-lg mb-4 border-4 border-white">
                  <AnimatePresence>
                    {avatar ? (
                      <motion.img
                        key="avatar"
                        src={avatar}
                        alt="User display picture"
                        className="h-full w-full object-cover rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div
                        key="no-avatar"
                        className="h-full w-full flex flex-col items-center justify-center bg-green-50 rounded-full relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <User className="h-14 w-14 text-green-400" />
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500 bg-white/80 rounded-full px-2 py-1 shadow">No picture</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 border border-glass-200 flex items-center gap-1">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <span className="text-xs text-gray-600">Upload</span>
                    <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                  </label>
                  {avatarError && (
                    <div className="absolute left-1/2 -bottom-8 transform -translate-x-1/2 text-xs text-red-500 bg-white/80 rounded px-2 py-1 shadow">{avatarError}</div>
                  )}
                </motion.div>
                <h3 className="mt-2 text-2xl font-bold text-glass-900">{user?.fullName || 'Guest'}</h3>
                <p className="text-base text-glass-600">{user?.email}</p>
                <p className="text-xs text-glass-400 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <TabsTrigger value="profile" className="w-full px-8 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-700 data-[state=active]:shadow-none font-semibold hover:bg-glass-200/40 transition-all">
                <User className="mr-3 h-5 w-5" /> Profile
              </TabsTrigger>
              <TabsTrigger value="addresses" className="w-full px-8 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-700 data-[state=active]:shadow-none font-semibold hover:bg-glass-200/40 transition-all">
                <MapPin className="mr-3 h-5 w-5" /> Addresses
              </TabsTrigger>
              <TabsTrigger value="orders" className="w-full px-8 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-700 data-[state=active]:shadow-none font-semibold hover:bg-glass-200/40 transition-all">
                <CreditCard className="mr-3 h-5 w-5" /> Orders
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full px-8 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-700 data-[state=active]:shadow-none font-semibold hover:bg-glass-200/40 transition-all">
                <Bell className="mr-3 h-5 w-5" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full px-8 py-4 text-left border-b border-white/30 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100/60 data-[state=active]:to-white/60 data-[state=active]:text-green-700 data-[state=active]:shadow-none font-semibold hover:bg-glass-200/40 transition-all">
                <Shield className="mr-3 h-5 w-5" /> Security
              </TabsTrigger>
              <div className="px-8 py-4">
                <LogoutButton />
              </div>
              <div className="bg-gradient-to-r from-green-100/60 via-white/40 to-green-200/40 p-4 rounded-b-3xl shadow mt-2">
                <h4 className="text-sm font-bold text-green-800">{user?.role === 'admin' ? 'Admin' : 'Premium Member'}</h4>
                <p className="mt-1 text-sm text-green-700">Enjoy free shipping and exclusive discounts.</p>
              </div>
            </motion.div>
          </TabsList>
          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-0">
              <motion.div layout className="glass-card shadow-xl rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-white/60 via-white/30 to-green-100/40">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-glass-900">Profile Information</h2>
                  <button className="btn-water px-4 py-2 rounded-full font-semibold shadow flex items-center gap-2 hover:scale-105 transition-transform" onClick={openEdit}>
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                </div>
                <div className="mb-4 flex flex-col md:flex-row gap-8">
                  <div>
                    <span className="font-semibold">Full Name:</span> {user?.fullName || 'Guest'}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {user?.email}
                  </div>
                  <div>
                    <span className="font-semibold">Role:</span> {user?.role}
                  </div>
                </div>
                {/* Edit Modal with improved UX */}
                <AnimatePresence>
                  {editOpen && (
                    <motion.div
                      key="edit-modal"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                      tabIndex={-1}
                      onClick={closeEdit}
                      onKeyDown={e => { if (e.key === 'Escape') closeEdit(); }}
                    >
                      <motion.div
                        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                        <form onSubmit={e => { e.preventDefault(); saveEdit(); }}>
                          <div className="mb-3">
                            <label htmlFor="edit-name" className="block text-sm font-semibold mb-1">Full Name</label>
                            <input
                              id="edit-name"
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-glass-200 focus:outline-none focus:ring-2 focus:ring-green-200 text-black placeholder:text-gray-400"
                              autoFocus
                              aria-required="true"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="edit-email" className="block text-sm font-semibold mb-1">Email</label>
                            <input
                              id="edit-email"
                              type="email"
                              value={editEmail}
                              onChange={e => setEditEmail(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-glass-200 focus:outline-none focus:ring-2 focus:ring-green-200 text-black placeholder:text-gray-400"
                              aria-required="true"
                              placeholder="Enter your email address"
                            />
                          </div>
                          {editError && (
                            <div className="mb-2 text-red-600 text-sm font-semibold">{editError}</div>
                          )}
                          {editSuccess && (
                            <div className="mb-2 text-green-700 text-sm font-semibold flex items-center gap-2">
                              <span>Profile updated!</span>
                            </div>
                          )}
                          <div className="flex gap-3 mt-6">
                            <button
                              type="submit"
                              className="btn-water px-4 py-2 rounded-full font-semibold shadow flex items-center justify-center"
                              disabled={editLoading}
                            >
                              {editLoading ? (
                                <span className="loader mr-2" />
                              ) : null}
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn-water px-4 py-2 rounded-full font-semibold shadow bg-red-100 text-red-700"
                              onClick={closeEdit}
                              disabled={editLoading}
                            >Cancel</button>
                          </div>
                        </form>
                        <button
                          className="absolute top-3 right-3 text-glass-400 hover:text-red-500"
                          onClick={closeEdit}
                          aria-label="Close"
                        >
                          ×
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
            {/* Addresses Tab */}
            <TabsContent value="addresses" className="mt-0">
              <motion.div layout className="glass-card shadow-xl rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-white/60 via-white/30 to-green-100/40">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-glass-900">Addresses</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAddress}
                      onChange={e => setNewAddress(e.target.value)}
                      placeholder="Add new address..."
                      className="px-3 py-2 rounded-lg border border-glass-200 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                    <button className="btn-water px-3 py-2 rounded-full font-semibold shadow flex items-center gap-1" onClick={addAddress}>
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  {addresses.length === 0 ? (
                    <div className="text-glass-500">No addresses added yet.</div>
                  ) : (
                    addresses.map((addr, idx) => (
                      <motion.div key={idx} layout className="flex items-center justify-between bg-white/40 rounded-xl px-4 py-2 shadow">
                        <span>{addr}</span>
                        <button className="text-red-500 hover:text-red-700" onClick={() => removeAddress(idx)}>
                          <XCircle className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>
            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-0">
              <motion.div layout className="glass-card shadow-xl rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-white/60 via-white/30 to-green-100/40">
                <h2 className="text-2xl font-bold mb-6 text-glass-900">Order History</h2>
                <div className="mb-4 space-y-2">
                  {/* TODO: Replace with real order data */}
                  <div className="bg-white/40 rounded-xl px-4 py-2 shadow flex items-center justify-between">
                    <span>Order #12345</span>
                    <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Delivered</span>
                  </div>
                  <div className="bg-white/40 rounded-xl px-4 py-2 shadow flex items-center justify-between">
                    <span>Order #12346</span>
                    <span className="text-yellow-600 font-semibold flex items-center gap-1"><CreditCard className="h-4 w-4" /> Processing</span>
                  </div>
                </div>
                <div className="text-center">
                  <Link
                    to="/orders"
                    className="btn-water px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition-transform"
                  >
                    View All Orders
                  </Link>
                </div>
              </motion.div>
            </TabsContent>
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <motion.div layout className="glass-card shadow-xl rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-white/60 via-white/30 to-green-100/40">
                <h2 className="text-2xl font-bold mb-6 text-glass-900">Notifications</h2>
                <div className="mb-4 space-y-2">
                  {notif.length === 0 ? (
                    <div className="text-glass-500">No notifications yet.</div>
                  ) : (
                    notif.map((n, idx) => (
                      <motion.div key={idx} layout className="bg-white/40 rounded-xl px-4 py-2 shadow flex items-center gap-2">
                        <Bell className="h-5 w-5 text-green-400" />
                        <span>{n}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>
            {/* Security Tab */}
            <TabsContent value="security" className="mt-0">
              <motion.div layout className="glass-card shadow-xl rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-white/60 via-white/30 to-green-100/40">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-glass-900">Security Settings</h2>
                  <button className="btn-water px-4 py-2 rounded-full font-semibold shadow flex items-center gap-2 hover:scale-105 transition-transform" onClick={() => setSecurityOpen(true)}>
                    <Shield className="h-4 w-4" /> Change Password
                  </button>
                </div>
                <AnimatePresence>
                  {securityOpen && (
                    <motion.div
                      key="security-modal"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    >
                      <motion.div
                        className="glass-card p-8 rounded-2xl shadow-2xl w-full max-w-md"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                      >
                        <h3 className="text-xl font-bold mb-4">Change Password</h3>
                        <div className="mb-3">
                          <label className="block text-sm font-semibold mb-1">New Password</label>
                          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-glass-200 focus:outline-none focus:ring-2 focus:ring-green-200" />
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button className="btn-water px-4 py-2 rounded-full font-semibold shadow" onClick={handlePasswordChange}>Save</button>
                          <button className="btn-water px-4 py-2 rounded-full font-semibold shadow bg-red-100 text-red-700" onClick={() => setSecurityOpen(false)}>Cancel</button>
                        </div>
                        {passwordChanged && (
                          <div className="mt-4 text-green-700 font-semibold flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" /> Password changed successfully!
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;

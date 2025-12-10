import avatar1 from '@/assets/avatars/avatar1.png';
import avatar2 from '@/assets/avatars/avatar2.png';
import avatar3 from '@/assets/avatars/avatar3.png';
import avatar4 from '@/assets/avatars/avatar4.png';
import avatar5 from '@/assets/avatars/avatar5.png';
import avatar6 from '@/assets/avatars/avatar6.png';
import { AvatarEditDialog } from '@/components/profile/AvatarEditDialog.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, updateUser } from '@/store/slices/authSlice';
import { getProfile, updateProfile, uploadAvatar } from '@/services/profileApi';
import {
  ArrowLeft,
  Edit3,
  LogOut,
  Mail,
  Save,
  User,
  UserCircle,
  Building,
  X,
  Loader2
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    organization: '',
    role: '',
    email: '',
    user_id: '',
    organization_id: '',
    created_at: '',
    updated_at: '',
    permissions: {
      analytics: false,
      email_drafting: false,
      producer_management: false,
      strategy_planning: false
    },
    preferences: {
      default_model: '',
      file_downloads_enabled: false,
      streaming_enabled: false
    },
    aws_resources: {
      dynamodb_tables: [],
      opensearch_domain: null,
      s3_bucket: null
    }
  });
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    organization: '',
    role: '',
  });

  // SEO: Title, description, canonical
  React.useEffect(() => {
    document.title = 'Profile - Account Settings';
    const ensureMeta = (name: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.name = name
        document.head.appendChild(el)
      }
      return el
    }
    const desc = ensureMeta('description')
    desc.setAttribute('content', 'Manage your profile settings, edit avatar, and update your account information.');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = window.location.href
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await getProfile();

      const profile = response.profile || response;

      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        organization: profile.organization || profile.organization_id || '',
        role: profile.role || '',
        email: profile.email || user?.email || '',
        user_id: profile.user_id || '',
        organization_id: profile.organization_id || '',
        created_at: profile.created_at || '',
        updated_at: profile.updated_at || '',
        permissions: profile.permissions || {
          analytics: false,
          email_drafting: false,
          producer_management: false,
          strategy_planning: false
        },
        preferences: profile.preferences || {
          default_model: '',
          file_downloads_enabled: false,
          streaming_enabled: false
        },
        aws_resources: profile.aws_resources || {
          dynamodb_tables: [],
          opensearch_domain: null,
          s3_bucket: null
        }
      });
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        organization: profile.organization || profile.organization_id || '',
        role: profile.role || ''
      });
    } catch (error) {
      // console.error('Error fetching profile:', error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load profile data. Please try again.",
      //   variant: "destructive"
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out",
      description: "You've been successfully logged out."
    });
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const updatedProfile = await updateProfile(editForm);

      setProfileData(prev => ({
        ...prev,
        ...updatedProfile
      }));

      if (user) {
        dispatch(updateUser({
          username: `${updatedProfile.first_name} ${updatedProfile.last_name}`.trim(),
          email: profileData.email,
          role: updatedProfile.role,
        }));
      }

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      organization: profileData.organization,
      role: profileData.role,
    });
    setIsEditing(false);
  };

  const handleAvatarSelect = async (url) => {
    try {
      if (url instanceof File) {
        const result = await uploadAvatar(url);
        toast({
          title: 'Avatar updated',
          description: 'Your profile picture has been updated.'
        });
      } else {
        toast({
          title: 'Avatar updated',
          description: 'Your profile picture has been updated.'
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || 'Taylor Quinn ';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header - Mobile First Responsive with Sticky Positioning */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between py-3 sm:py-4 gap-3 xs:gap-0">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-fast w-fit group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden xs:inline">Back to Dashboard</span>
              <span className="xs:hidden">Back</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full xs:w-auto h-9 sm:h-10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content - Mobile First Responsive with Optimal Spacing */}
      <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 lg:py-12">
        <div className="space-y-4 xs:space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Profile Header Card - Responsive Layout */}
          <Card className="p-4 xs:p-5 sm:p-6 lg:p-8 shadow-elegant liquid-glass">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
              {/* Avatar and Basic Info Section - Responsive Stack */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 sm:gap-6">
                {/* Avatar Section - Responsive Sizing */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shadow-soft">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg xs:text-xl sm:text-xl lg:text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-1 -right-1 xs:-bottom-1.5 xs:-right-1.5 sm:-bottom-2 sm:-right-2 rounded-full shadow-soft w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 hover:scale-110 transition-transform"
                    onClick={() => setAvatarDialogOpen(true)}
                    aria-label="Edit avatar"
                  >
                    <Edit3 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Profile Info Section - Responsive Typography */}
                <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 flex-1 min-w-0">
                  <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                    {fullName}
                  </h1>
                  <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
                    taylor.quinn@meridianwl.com
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
                    <Badge variant="secondary" className="text-xs xs:text-sm px-2 py-1">
                      Sales Manager
                    </Badge>
                    <Badge variant="outline" className="text-xs xs:text-sm px-2 py-1">
                      Meridian Wealth & Life
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Edit Button Section - Responsive Positioning */}
              {!isEditing && (
                <div className="flex-shrink-0 w-full xs:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                    className="w-full xs:w-auto h-9 sm:h-10"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Two Column Layout - Profile Information and Activity Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 lg:gap-10">
            {/* Profile Information Card */}
            <Card className="p-4 xs:p-5 sm:p-6 lg:p-8 shadow-soft liquid-glass">
              <h3 className="text-base xs:text-lg sm:text-lg lg:text-xl font-semibold text-foreground flex items-center gap-2 mb-4 xs:mb-5 sm:mb-6">
                <UserCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
                Profile Information
              </h3>

              {isLoading && (
                <div className="flex items-center justify-center py-8 xs:py-10 sm:py-12">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm xs:text-sm sm:text-base">Loading profile...</span>
                </div>
              )}

              {!isLoading && (
                isEditing ? (
                  /* Edit Form - Responsive Grid with Optimal Spacing */
                  <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                    <div className="space-y-4 xs:space-y-5">
                      <div className="space-y-2 xs:space-y-2.5">
                        <Label htmlFor="edit-first-name" className="text-sm font-medium">
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="edit-first-name"
                            value={editForm.first_name || "Taylor Quinn "}
                            onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                            className="pl-10 h-9 xs:h-10 sm:h-11 text-sm xs:text-sm sm:text-base"
                            placeholder="Enter first name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 xs:space-y-2.5">
                        <Label htmlFor="edit-last-name" className="text-sm font-medium">
                          Last Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="edit-last-name"
                            value={editForm.last_name}
                            onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                            className="pl-10 h-9 xs:h-10 sm:h-11 text-sm xs:text-sm sm:text-base"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 xs:space-y-2.5">
                        <Label htmlFor="edit-organization" className="text-sm font-medium">
                          Organization
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="edit-organization"
                            value={editForm.organization}
                            onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
                            className="pl-10 h-9 xs:h-10 sm:h-11 text-sm xs:text-sm sm:text-base"
                            placeholder="Enter organization"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 xs:space-y-2.5">
                        <Label htmlFor="edit-role" className="text-sm font-medium">
                          Role
                        </Label>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="edit-role"
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="pl-10 h-9 xs:h-10 sm:h-11 text-sm xs:text-sm sm:text-base"
                            placeholder="Enter role"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Responsive Layout with Optimal Ordering */}
                    <div className="flex flex-col sm:flex-row gap-3 xs:gap-3 sm:gap-4 pt-4 xs:pt-5 sm:pt-6">
                      <Button
                        variant="premium"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="w-full sm:w-auto order-2 sm:order-1 h-9 sm:h-10"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="w-full sm:w-auto order-1 sm:order-2 h-9 sm:h-10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* View Mode - Clean Layout matching image design */
                  <div className="space-y-4 xs:space-y-5 ">
                    <div className='grid grid-cols-2 w-full'>
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-muted-foreground mb-1.5 xs:mb-2">
                          First Name
                        </p>
                        <p className="text-sm xs:text-base sm:text-base text-foreground font-medium">
                          {profileData.first_name || 'Taylor'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-muted-foreground mb-1.5 xs:mb-2">
                          Last Name
                        </p>
                        <p className="text-sm xs:text-base sm:text-base text-foreground font-medium">
                          {profileData.last_name || 'Quinn'}
                        </p>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 w-full'>
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-muted-foreground mb-1.5 xs:mb-2">
                          Role
                        </p>
                        <p className="text-sm xs:text-base sm:text-base text-foreground font-medium">
                          Sales Manager
                        </p>
                      </div>
                      <div>
                        <p className="text-xs xs:text-sm font-medium text-muted-foreground mb-1.5 xs:mb-2">
                          Email Address
                        </p>
                        <p className="text-sm xs:text-base sm:text-base text-foreground font-medium break-all">
                          taylor.quinn@meridianwl.com
                        </p>
                      </div>
                      </div>
                    <div>
                      <p className="text-xs xs:text-sm font-medium text-muted-foreground mb-1.5 xs:mb-2">
                        Organization
                      </p>
                      <p className="text-sm xs:text-base sm:text-base text-foreground font-medium">
                        Meridian Wealth & Life
                      </p>
                    </div>
                  </div>
                )
              )}
            </Card>

            {/* Activity Summary Card */}
            <Card className="p-4 xs:p-5 sm:p-6 lg:p-8 shadow-soft liquid-glass">
              <h3 className="text-base xs:text-lg sm:text-lg lg:text-xl font-semibold text-foreground mb-4 xs:mb-5 sm:mb-6">
                Activity Summary
              </h3>
              <div className="space-y-4 xs:space-y-5 flex items-center text-center">
                <div className="text-center space-y-2 xs:space-y-2.5 sm:space-y-3 p-3 xs:p-3.5 sm:p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                    42
                  </div>
                  <p className="text-xs xs:text-sm text-muted-foreground leading-relaxed">
                    AI Queries This Month
                  </p>
                </div>
                <div className="!mt-0 text-center space-y-2 xs:space-y-2.5 sm:space-y-3 p-3 xs:p-3.5 sm:p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold text-teal-600">
                    18
                  </div>
                  <p className="text-xs xs:text-sm text-muted-foreground leading-relaxed">
                    Emails Generated
                  </p>
                </div>
                <div className=" !mt-0 text-center space-y-2 xs:space-y-2.5 sm:space-y-3 p-3 xs:p-3.5 sm:p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                    7
                  </div>
                  <p className="text-xs xs:text-sm text-muted-foreground leading-relaxed">
                    Reports Downloaded
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Avatar Dialog */}
      <AvatarEditDialog
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
        presets={[avatar1, avatar2, avatar3, avatar4, avatar5, avatar6]}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
}
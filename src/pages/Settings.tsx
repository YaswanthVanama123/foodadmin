import React, { useState, useEffect } from 'react';
import { Upload, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/common';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { uploadApi } from '../api/upload.api';
import { apiClient } from '../api/client';

interface RestaurantSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        toast.error('Restaurant ID not found');
        return;
      }

      const response = await apiClient.get(`/restaurants/${restaurantId}`);
      if (response.data.success) {
        console.log('[Settings] Fetched restaurant data:', response.data.data);
        setSettings(response.data.data);
        // Handle both old string format and new object format
        const logo = response.data.data.branding?.logo;
        console.log('[Settings] Logo data:', logo);
        if (logo) {
          // If logo is an object, use the original URL, otherwise use as string
          const logoUrl = typeof logo === 'object' ? logo.original : logo;
          console.log('[Settings] Logo URL to display:', logoUrl);
          if (logoUrl) {
            setLogoPreview(logoUrl);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error('Please select a logo file');
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await uploadApi.uploadLogo(formData);

      if (response.success) {
        toast.success('Logo uploaded successfully');
        // Update logo preview
        setLogoPreview(response.data.logoUrl);
        // Update settings state with new logo
        setSettings((prev) => prev ? {
          ...prev,
          branding: {
            ...prev.branding,
            logo: {
              original: response.data.logoUrl,
              medium: '',
              small: '',
            },
          },
        } : null);
        setLogoFile(null);
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const restaurantId = localStorage.getItem('restaurantId');

      const response = await apiClient.put(`/restaurants/${restaurantId}`, {
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        branding: settings.branding,
      });

      if (response.data.success) {
        toast.success('Settings saved successfully');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Restaurant Settings"
        subtitle="Manage your restaurant information and branding"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Restaurant Logo</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Logo Preview */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, or SVG (max 5MB)
                </p>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUploadLogo}
                disabled={!logoFile || uploadingLogo}
                isLoading={uploadingLogo}
                className="w-full"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Logo
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Restaurant Information</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Restaurant Name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />

              <Input
                label="Email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />

              <Input
                label="Phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />

              <Input
                label="Address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Branding Colors */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Brand Colors</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={settings.branding.primaryColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, primaryColor: e.target.value },
                    })}
                    className="h-12 w-24 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={settings.branding.primaryColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, primaryColor: e.target.value },
                    })}
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={settings.branding.secondaryColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, secondaryColor: e.target.value },
                    })}
                    className="h-12 w-24 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={settings.branding.secondaryColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, secondaryColor: e.target.value },
                    })}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-lg"
                  style={{ backgroundColor: settings.branding.primaryColor }}
                ></div>
                <div
                  className="h-12 w-12 rounded-lg"
                  style={{ backgroundColor: settings.branding.secondaryColor }}
                ></div>
                <p className="text-sm text-gray-600">Preview</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSaveSettings}
          isLoading={saving}
          disabled={saving}
          size="lg"
        >
          <Save className="h-5 w-5 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;

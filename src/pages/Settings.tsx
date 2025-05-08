
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  Settings2,
  Bell,
  Key,
  Users,
  Workflow,
  Globe,
  Database,
} from "lucide-react";

const Settings = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    flowName: "My Onboarding Flow",
    webhook: "https://api.example.com/webhook",
    trackEvents: true,
    collectUserData: true,
    enableAnalytics: true,
    sendNotifications: false,
    publicAccess: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  const saveSettings = () => {
    // Here would be the API call to save settings
    toast({
      title: "Settings saved",
      description: "Your flow settings have been updated successfully",
    });
  };

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Flow Settings</h1>
          <p className="text-muted-foreground">
            Configure global settings for your onboarding flow
          </p>
        </div>
        <Button onClick={saveSettings}>Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Team</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API Access</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Data & Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for your onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="flowName">Flow Name</Label>
                <Input 
                  id="flowName" 
                  name="flowName"
                  value={settings.flowName} 
                  onChange={handleInputChange}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publicAccess">Public Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anyone to access this onboarding flow without authentication
                    </p>
                  </div>
                  <Switch 
                    id="publicAccess"
                    checked={settings.publicAccess}
                    onCheckedChange={(checked) => handleSwitchChange('publicAccess', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Configure which domains your onboarding flow can be displayed on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Label>Allowed Domains</Label>
                </div>
                <div className="space-y-2">
                  <Input placeholder="example.com" />
                  <Input placeholder="app.example.com" />
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Domain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Set up webhooks to notify your systems when users interact with your onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input 
                  id="webhook" 
                  name="webhook"
                  value={settings.webhook} 
                  onChange={handleInputChange}
                  placeholder="https://api.example.com/webhook"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Test Webhook</Label>
                  <p className="text-sm text-muted-foreground">
                    Send a test event to your webhook endpoint
                  </p>
                </div>
                <Button variant="outline">Send Test</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Connect your onboarding flow to other services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">GA</div>
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-xs text-muted-foreground">Track usage in GA4</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">MP</div>
                    <div>
                      <h4 className="font-medium">Mixpanel</h4>
                      <p className="text-xs text-muted-foreground">Send events to Mixpanel</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection</CardTitle>
              <CardDescription>
                Configure how user data is collected and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackEvents">Event Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when users view or interact with flow steps
                  </p>
                </div>
                <Switch 
                  id="trackEvents"
                  checked={settings.trackEvents}
                  onCheckedChange={(checked) => handleSwitchChange('trackEvents', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collectUserData">User Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Store user-submitted data from forms
                  </p>
                </div>
                <Switch 
                  id="collectUserData"
                  checked={settings.collectUserData}
                  onCheckedChange={(checked) => handleSwitchChange('collectUserData', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAnalytics">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate analytics and insights from onboarding data
                  </p>
                </div>
                <Switch 
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => handleSwitchChange('enableAnalytics', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>
                Export collected data for further analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">User Interaction Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Export all user interactions with your onboarding flow
                  </p>
                </div>
                <Button variant="outline">Export CSV</Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Form Submissions</h4>
                  <p className="text-sm text-muted-foreground">
                    Export all form data collected through your flow
                  </p>
                </div>
                <Button variant="outline">Export CSV</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to this onboarding flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.email || 'Current User'}</p>
                      <p className="text-xs text-muted-foreground">Owner</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Invite Team Member</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important onboarding events
                  </p>
                </div>
                <Switch 
                  id="sendNotifications"
                  checked={settings.sendNotifications}
                  onCheckedChange={(checked) => handleSwitchChange('sendNotifications', checked)}
                />
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-3">Notification Events</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyCompletions" />
                    <Label htmlFor="notifyCompletions">Flow completions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyDropOffs" />
                    <Label htmlFor="notifyDropOffs">User drop-offs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyFormSubmissions" />
                    <Label htmlFor="notifyFormSubmissions">Form submissions</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to your onboarding flows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">Production API Key</h4>
                  <p className="text-sm text-muted-foreground">For use in production environments</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Show Key</Button>
                  <Button variant="outline">Rotate</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h4 className="font-medium">Development API Key</h4>
                  <p className="text-sm text-muted-foreground">For testing and development</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">Show Key</Button>
                  <Button variant="outline">Rotate</Button>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">API Documentation</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to integrate with our API to programmatically manage your onboarding flows
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

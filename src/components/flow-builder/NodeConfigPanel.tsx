
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ImageIcon, Link } from "lucide-react";

export function NodeConfigPanel({ node, updateNodeData }) {
  const [label, setLabel] = useState(node.data.label || '');
  const [content, setContent] = useState(node.data.content || '');
  
  const handleSave = () => {
    updateNodeData({ 
      label, 
      content 
    });
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
          <TabsTrigger value="styling" className="flex-1">Styling</TabsTrigger>
          <TabsTrigger value="targeting" className="flex-1">Targeting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nodeLabel">Node Label</Label>
            <Input 
              id="nodeLabel" 
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node label"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nodeContent">Content</Label>
            <Textarea 
              id="nodeContent" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              rows={6}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Link className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="styling" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex space-x-2">
              <Button size="sm" className="h-8 w-8 rounded-full bg-quickstartify-purple p-0" />
              <Button size="sm" className="h-8 w-8 rounded-full bg-blue-500 p-0" />
              <Button size="sm" className="h-8 w-8 rounded-full bg-green-500 p-0" />
              <Button size="sm" className="h-8 w-8 rounded-full bg-amber-500 p-0" />
              <Button size="sm" className="h-8 w-8 rounded-full bg-red-500 p-0" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex space-x-2">
              <Button size="sm" className="h-8 w-8 rounded-full bg-white border p-0" />
              <Button size="sm" className="h-8 w-8 rounded-full bg-black p-0" />
              <Button size="sm" className="h-8 w-8 rounded-full bg-gray-500 p-0" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">S</Button>
              <Button variant="outline" size="sm">M</Button>
              <Button variant="outline" size="sm">L</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="targeting" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="targetSelector">Target Element</Label>
            <Input 
              id="targetSelector" 
              placeholder="#welcome-button, .main-nav"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetPage">Target Page</Label>
            <Input 
              id="targetPage" 
              placeholder="/dashboard"
            />
          </div>
          
          <Card className="p-4 mt-4 bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <p className="text-xs">
              Click "Preview" to visually select elements from your site to use as targets.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <Button 
          className="w-full bg-quickstartify-purple hover:bg-quickstartify-purple/90"
          onClick={handleSave}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ChartVisualization = ({
  title,
  imageUrl,
  description
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const handleCopyImage = async () => {
    try {
      // In a real implementation, this would copy the image to clipboard
      toast({
        title: "Image Copied",
        description: "Chart image copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy image to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownloadImage = () => {
    // In a real implementation, this would trigger image download
    toast({
      title: "Download Started",
      description: "Chart image is downloading for PowerPoint use"
    });
  };

  return (
    <Card className="mt-4 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 p-0 border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
            onClick={handleCopyImage}
            title="Copy"
            aria-label="Copy"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 p-0 border-0 shadow-none hover:bg-transparent focus-visible:ring-0"
            onClick={handleDownloadImage}
            title="Download"
            aria-label="Download"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div 
        className="relative rounded-lg overflow-hidden bg-muted/20 border border-border cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Placeholder for chart image */}
        <div className="aspect-video flex items-center justify-center bg-gradient-soft">
          <div className="text-center space-y-2">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Chart visualization would display here
            </p>
            <p className="text-xs text-muted-foreground">
              (PNG/JPEG format ready for PowerPoint)
            </p>
          </div>
        </div>
        
        {/* Hover overlay with action buttons */}
        {isHovering && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-fast">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleCopyImage}
            >
              <Copy className="w-4 h-4" />
              Copy for Clipboard
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleDownloadImage}
            >
              <Download className="w-4 h-4" />
              Download for PowerPoint
            </Button>
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mt-3">{description}</p>
      )}
    </Card>
  );
};

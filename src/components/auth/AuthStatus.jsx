import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AuthStatus = () => {
  const { user, isAuthenticated, accessToken, isLoading, error } = useAppSelector((state) => state.auth);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Redux Auth Status  </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={isAuthenticated ? "default" : "secondary"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Loading:</span>
            <Badge variant={isLoading ? "default" : "outline"}>
              {isLoading ? "Yes" : "No"}
            </Badge>
          </div>

          {error && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Error:</span>
              <Badge variant="destructive">{error}</Badge>
            </div>
          )}
        </div>

        {user && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">User Info:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Company:</strong> {user.company}</p>
            </div>
          </div>
        )}

        {accessToken && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Token Info:</h4>
            <div className="text-sm">
              <p><strong>Access Token:</strong> {accessToken.substring(0, 20)}...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

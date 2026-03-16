import React from 'react';
import Button from '../ui/Button';

interface FollowButtonProps {
  status: 'none' | 'following' | 'requested';
  onFollow: () => void;
  onUnfollow: () => void;
  loading?: boolean;
}

export default function FollowButton({ status, onFollow, onUnfollow, loading = false }: FollowButtonProps) {
  if (status === 'following') {
    return (
      <Button
        title="Following"
        onPress={onUnfollow}
        variant="outline"
        size="sm"
        loading={loading}
      />
    );
  }
  if (status === 'requested') {
    return (
      <Button
        title="Requested"
        onPress={onUnfollow}
        variant="ghost"
        size="sm"
        loading={loading}
      />
    );
  }
  return (
    <Button
      title="Follow"
      onPress={onFollow}
      size="sm"
      loading={loading}
    />
  );
}

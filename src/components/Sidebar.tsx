"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { getUserByClerkId } from "@/actions/user.action";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { getFollowers, getFollowing } from "@/actions/profile.action";
import { ProfileSkeleton } from "./ProfileSkeleton";

export default function Sidebar() {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Dialog state for followers and following
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // State for fetched followers and following data
  const [followersData, setFollowersData] = useState<
    Array<{ follower: { id: string; name: string | null; username: string; image: string | null } }>
  >([]);
  const [followingData, setFollowingData] = useState<
    Array<{ following: { id: string; name: string | null; username: string; image: string | null } }>
  >([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  // Fetch user info from your server using the clerk user id
  useEffect(() => {
    async function fetchUser() {
      if (clerkUser) {
        const data = await getUserByClerkId(clerkUser.id);
        setUser(data);
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, [clerkUser]);

  // Fetch followers data when the followers dialog is opened
  useEffect(() => {
    if (showFollowers && user) {
      (async () => {
        setLoadingFollowers(true);
        try {
          const data = await getFollowers(user.id);
          setFollowersData(data);
        } catch (err) {
          console.error("Error fetching followers:", err);
        } finally {
          setLoadingFollowers(false);
        }
      })();
    }
  }, [showFollowers, user]);

  // Fetch following data when the following dialog is opened
  useEffect(() => {
    if (showFollowing && user) {
      (async () => {
        setLoadingFollowing(true);
        try {
          const data = await getFollowing(user.id);
          setFollowingData(data);
        } catch (err) {
          console.error("Error fetching following:", err);
        } finally {
          setLoadingFollowing(false);
        }
      })();
    }
  }, [showFollowing, user]);

  if (loadingUser) {
    return <ProfileSkeleton />;
  }

  if (!clerkUser) {
    return <UnAuthenticatedSidebar />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2">
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>
              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>

            {user.bio && (
              <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>
            )}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div
                  className="cursor-pointer"
                  onClick={() => setShowFollowing(true)}
                >
                  <p className="font-medium">{user._count.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div
                  className="cursor-pointer"
                  onClick={() => setShowFollowers(true)}
                >
                  <p className="font-medium">{user._count.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a
                    href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                    className="hover:underline truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          {loadingFollowers ? (
            <ProfileSkeleton />
          ) : followersData.length > 0 ? (
            followersData.map((follow) => (
              <div
                key={follow.follower.id}
                className="flex items-center space-x-4 py-2 border-b cursor-pointer"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={follow.follower.image || "/avatar.png"}
                  />
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {follow.follower.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{follow.follower.username}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No followers found.
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-4 w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          {loadingFollowing ? (
            <ProfileSkeleton />
          ) : followingData.length > 0 ? (
            followingData.map((follow) => (
              <div
                key={follow.following.id}
                className="flex items-center space-x-4 py-2 border-b cursor-pointer"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={follow.following.image || "/avatar.png"}
                  />
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {follow.following.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{follow.following.username}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No following users found.
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-4 w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UnAuthenticatedSidebar() {
  return (
    <div className="sticky top-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Welcome Back!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Login to access your profile and connect with others.
          </p>
          <SignInButton mode="modal">
            <Button className="w-full" variant="outline">
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="w-full mt-2" variant="default">
              Sign Up
            </Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
}

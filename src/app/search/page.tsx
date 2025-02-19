'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfileSkeleton } from '@/components/ProfileSkeleton';
import { searchUser } from '@/actions/user.action';

interface User {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
}

const SearchPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result: User[] = await searchUser(query);
      setUsers(result);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
      <form onSubmit={handleSearch} className="relative w-full max-w-md mb-4">
        <SearchIcon
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="pl-10"
        />
      </form>

      <div className="w-full max-w-md">
        {loading ? (
          <ProfileSkeleton />
        ) : users.length === 0 ? (
          <div className="text-center text-muted-foreground">Search for more Users</div>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center space-x-4 p-4 border rounded-lg bg-card hover:bg-muted transition-colors"
                >
                  <Avatar>
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name || user.username} />
                    ) : (
                      <AvatarFallback>
                        {(user.name ? user.name.charAt(0) : user.username.charAt(0)).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {user.name || "No Name Provided"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

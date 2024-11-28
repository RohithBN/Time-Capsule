'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-950 text-white shadow-md h-24 rounde-xl ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center align-middle">
        <Link href="/" className="text-3xl font-semibold tracking-tight mt-4">
          Capsule App
        </Link>

        <div className="flex items-center space-x-6">
          {/* If session exists, show Create Capsule and Logout */}
          {session ? (
            <>
              <Button className="bg-white text-black hover:bg-gray-100">
                <Link href="/capsule" className="text-lg hover:text-slate-500">
                  Create Capsule
                </Link>
              </Button>
              
              <Button onClick={() => signOut()} className="bg-white text-black hover:bg-gray-100 text-lg hover:text-slate-500">
                Logout
              </Button>
            </>
          ) : (
            // If session doesn't exist, show Sign In and Sign Up
            <>
              <Link href="/signin" className="text-lg hover:text-blue-300 transition-all">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-lg bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-lg transition-all duration-200 ease-in-out"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

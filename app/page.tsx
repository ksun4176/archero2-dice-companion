"use client"

import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";
import WhereAreDiceContent from "./_components/where-are-dice-content";

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="min-w-sm max-w-7xl mx-auto p-4 min-h-screen">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="text-xl font-bold">Dice Companion</h1>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={()=> setShowInfo(!showInfo)}
          >
            <Info size={20} />
          </Button>
          <a href='https://ko-fi.com/O4O71FBM0I' target='_blank'>
            <img
              className="h-9 border-0"
              src='https://storage.ko-fi.com/cdn/kofi5.png?v=6'
              alt='Buy Me a Coffee at ko-fi.com'
            />
          </a>
        </div>
      </div>
 
      {showInfo && (
        <div className="mb-4 p-2 bg-secondary border rounded-lg text-sm">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ul className="space-y-1 list-disc pl-4">
            <li>Track the amount of dice you can still get</li>
            <li>Track your rolls</li>
            <li>Calculate your Points per Initial Dice to see how you did compared to others</li>
          </ul>
        </div>
      )}

      <WhereAreDiceContent />
    </div>
  );
};
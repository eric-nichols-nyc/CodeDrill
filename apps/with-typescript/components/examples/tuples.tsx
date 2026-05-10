"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useState } from "react";

type Point = [number, number];
type UserInfo = [string, number, boolean];

export const TuplesExamples = () => {
  const [point] = useState<Point>([10, 20]);
  const [user] = useState<UserInfo>(["John Doe", 30, true]);
  const [coordinates, setCoordinates] = useState<Point>([0, 0]);

  const movePoint = (x: number, y: number) => {
    setCoordinates([x, y]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Point Tuple</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-mono text-sm">
              const point: Point = [{point[0]}, {point[1]}]
            </p>
            <p className="mt-2 text-sm">
              X: {point[0]}, Y: {point[1]}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Info Tuple</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="font-mono text-sm">
              const user: UserInfo = ["{user[0]}", {user[1]}, {String(user[2])}]
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>Name: {user[0]}</p>
              <p>Age: {user[1]}</p>
              <p>Active: {user[2] ? "Yes" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Coordinates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                movePoint(0, 0);
              }}
              size="sm"
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                movePoint(coordinates[0] + 1, coordinates[1]);
              }}
              size="sm"
            >
              Move X+1
            </Button>
            <Button
              onClick={() => {
                movePoint(coordinates[0], coordinates[1] + 1);
              }}
              size="sm"
            >
              Move Y+1
            </Button>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="font-mono text-sm">
              Current: [{coordinates[0]}, {coordinates[1]}]
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

#!/bin/bash
sed -i "s/import { ChildReviewDashboard } from '.\/components\/ChildReviewDashboard';//g" src/App.tsx
sed -i "s/import { getStudentResults, StudentResult } from '.\/lib\/db';//g" src/App.tsx
sed -i "s/import { ChildDashboard } from '.\/components\/ChildDashboard';/import { ChildArea } from '.\/components\/ChildArea';/g" src/App.tsx

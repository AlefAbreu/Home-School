#!/bin/bash
sed -i "s/import { ChildDashboard } from '.\/components\/ChildDashboard';/import { ChildDashboard } from '.\/components\/ChildDashboard';\nimport { ChildReviewDashboard } from '.\/components\/ChildReviewDashboard';\nimport { getStudentResults, StudentResult } from '.\/lib\/db';/g" src/App.tsx

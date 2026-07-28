#!/bin/bash
sed -i "s/import { StudentResult, updateStudentResult, getGamification, incrementMissions, awardBadge, UserStats } from '..\/lib\/db';/import { StudentResult, updateStudentResult, getGamification, incrementMissions, awardBadge, UserStats } from '..\/lib\/db';\nimport { FileText } from 'lucide-react';/g" src/components/ChildReviewDashboard.tsx

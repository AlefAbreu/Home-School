#!/bin/bash
sed -i "s/const hasReading = allTasks.some(t => t.type === 'reading') && result.readingText;/const hasReading = !!result.readingText;/g" src/components/ChildReviewDashboard.tsx

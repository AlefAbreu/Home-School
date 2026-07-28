#!/bin/bash
sed -i "s/{hasReading && (/{true \&\& (/g" src/components/ChildReviewDashboard.tsx
sed -i "s/\${hasReading ? 'lg:w-7\/12' : ''}/lg:w-7\/12/g" src/components/ChildReviewDashboard.tsx
sed -i "s/activeTab === 'activities' || \!hasReading/activeTab === 'activities'/g" src/components/ChildReviewDashboard.tsx

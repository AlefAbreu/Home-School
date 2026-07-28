#!/bin/bash
sed -i "s/if (confirm('Tem certeza que deseja excluir esta missão?')) {/if (true) {/g" src/components/TutorDashboard.tsx

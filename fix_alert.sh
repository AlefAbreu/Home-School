#!/bin/bash
sed -i "s/alert('Arquivo JSON inválido. Verifique o formato.');/console.error('Arquivo JSON inválido. Verifique o formato.');/g" src/components/TutorDashboard.tsx

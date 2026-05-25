# ScholarTrack

A React Native (Expo) mobile app that helps Filipino students find scholarships matched to their course or program. All data is stored locally on the device — no backend or internet account required.

Developed by: Mykel Rey De Los Reyes, Lorenzen Ilon, Joeric Israel Gonzales

## Features

- Course-based scholarship matching (e.g. BSIT, BSN, BSEd)
- Search scholarships by name, deadline, or course code
- Save and manage a personal shortlist
- Edit profile and upload a profile photo
- Fully offline — uses AsyncStorage for local persistence

## Tech Stack

- React Native with Expo (~54)
- React Navigation (Stack)
- AsyncStorage
- Expo Image Picker, Expo Linear Gradient

## Notes

- Passwords are stored in plain text — this app is intended for academic/demo use.
- Scholarship matching uses exact course codes. Enter your course correctly during sign-up (e.g. `BSIT`, `BSN`).

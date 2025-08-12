#!/bin/bash

# 이 스크립트는 충돌하는 파일들을 제거합니다
# 실행 전 백업을 권장합니다

echo "Removing conflicting [id] folder..."
rm -rf app/play/\[id\]

echo "Done! The [id] folder has been removed."
echo "Now only [bundleId] folder exists in app/play/"

# 확인
echo "Current structure of app/play:"
ls -la app/play/
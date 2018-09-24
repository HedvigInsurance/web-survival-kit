#!/bin/bash
set -euxo pipefail

BASE_DIR="$(dirname $0)";
echo "Copying files to \"$BASE_DIR/build/createProject\"";
mkdir -p "$BASE_DIR/build/createProject";
cp -r "$BASE_DIR/../template/createProject/" "$BASE_DIR/build/createProject";
cp "$BASE_DIR/../.babelrc.js" "$BASE_DIR/build/createProject";
cp "$BASE_DIR/../.prettierrc.js" "$BASE_DIR/build/createProject";
cp "$BASE_DIR/../jest.config.js" "$BASE_DIR/build/createProject";
cp "$BASE_DIR/../test-setup-enzyme.js" "$BASE_DIR/build/createProject";
cp "$BASE_DIR/../tsconfig.json" "$BASE_DIR/build/createProject";
cp "$BASE_DIR/../tslint.json" "$BASE_DIR/build/createProject";

echo "Running scripts";
cd "$BASE_DIR/build/createProject" \
  && yarn \
  && pwd \
  && yarn lint \
  && yarn typecheck \
  && yarn test;

rm -rf "$BASE_DIR/build/createProject";

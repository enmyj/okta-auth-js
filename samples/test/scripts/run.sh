#!/bin/bash -x

# # Test specs/*
# if ! yarn test:specs; then
#   echo "Specs tests failed! Exiting..."
#   exit ${TEST_FAILURE}
# fi

# # Test features/*
# if ! yarn test:features; then
#   echo "Features tests failed! Exiting..."
#   exit ${TEST_FAILURE}
# fi

export SAMPLE_NAME=webpack-spa
if ! yarn test:specs; then
  echo "Specs tests failed! Exiting..."
  exit ${TEST_FAILURE}
fi

echo '##### FALSE FAILURE, NEEDED TO RERUN IN BACON #####'
exit 1
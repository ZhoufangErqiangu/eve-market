# Eve tools

## Build

- Build esi apis `yarn run build:esi`
- Build public data from sde
  1. Download sde file from eve development blog
  2. Put `fsd/blueprints.yaml` `fsd/marketGroups.yaml` `fsd/planetSchematics.yaml` `fsd/types.yaml` in `data/`
  3. `yarn run build:sde`
- Build dist `yarn run build`

## Design

- This app has no backend. All real-time data is requested from ESI.

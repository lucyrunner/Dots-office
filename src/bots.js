// Indoor restaurant demo fleet. Replace these concept rovers with the vehicle CAD model when available.
export const BOTS = [
  {
    id: 'dot-01',
    name: 'Dot-01',
    role: 'Dining-room runner',
    color: '#b9d64c',
    accessory: null,
    tasks: ['Leaving kitchen pass', 'Crossing the dining aisle', 'Delivering to Table 08'],
  },
  {
    id: 'dot-02',
    name: 'Dot-02',
    role: 'Table-service runner',
    color: '#e6a05b',
    accessory: null,
    tasks: ['En route · Table 12', 'LiDAR pose locked', 'Returning to kitchen pass'],
  },
  {
    id: 'dot-03',
    name: 'Dot-03',
    role: 'Kitchen expediter',
    color: '#7d9c49',
    accessory: null,
    tasks: ['Waiting at pickup shelf', 'Cloud route validated', 'Heading to Table 05'],
  },
  {
    id: 'dot-04',
    name: 'Dot-04',
    role: 'Dining-room support',
    color: '#a68dab',
    accessory: null,
    tasks: ['Service confirmed · Table 03', 'Returning to service station', 'Docked for charging'],
  },
];

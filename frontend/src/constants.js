export const API_BASE = 'http://localhost:5000';

export const REGION_DISTRICTS = {
  'Konkan':               ['mumbai','mumbai_suburban','thane','raigad','ratnagiri','sindhudurg','palghar'],
  'Western Maharashtra':  ['pune','satara','sangli','solapur','kolhapur','ahmednagar'],
  'Northern Maharashtra': ['nashik','dhule','nandurbar','jalgaon'],
  'Marathwada':           ['aurangabad','jalna','beed','osmanabad','latur','nanded','parbhani','hingoli'],
  'Vidarbha':             ['amravati','akola','washim','buldhana','yavatmal','nagpur','wardha','chandrapur','gadchiroli','gondia','bhandara'],
};

export const REGION_INFO = {
  'Konkan': { icon: '🌊', color: '#185FA5', desc: 'Coastal — high rainfall, laterite soil, tropical crops' },
  'Western Maharashtra': { icon: '🌿', color: '#3B6D11', desc: 'Plateau — black cotton soil, sugarcane & onion belt' },
  'Northern Maharashtra': { icon: '🍇', color: '#854F0B', desc: 'Mixed soil — grapes, banana, onion zone' },
  'Marathwada': { icon: '☀️', color: '#993C1D', desc: 'Drought-prone — black cotton, pulses & cotton' },
  'Vidarbha': { icon: '🍊', color: '#534AB7', desc: 'Eastern — cotton, orange & soybean belt' },
};

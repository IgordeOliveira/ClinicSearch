import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import * as middlewares from '../middlewares';
import { isOpen, getAllClinics } from '../services/clinicService';

const router = express.Router();

router.get<{}, MessageResponse>('/clinics/search', middlewares.checkSearchParams, async (req, res) => {

  const clinics = await getAllClinics();

  const name = req.query?.name;
  const state = req.query?.state;
  const from = req.query?.from as string ;
  const to = req.query?.to as string;

  // create object with only search params that came in request
  const conditions = {
    ...(name) && { name },
    ...(state) && { state },
    ...(from) && { from },
    ...(to) && { to },
  };

  const clinicsFiltred = clinics.filter(clinic => {
    return Object.keys(conditions).every(key => {
      if (key === 'name' || key === 'state') {
        // search for clinic value is the same of query value, except for availability ( from / to)
        return clinic[key].toLowerCase().includes(conditions[key]);
      } else { // availability
        return isOpen(clinic.availability, from, to);
      }
    });

  });
  res.json({
    data: clinicsFiltred,
  });
});


export default router;

/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import * as middlewares from '../middlewares';
import { getAllClinics } from '../services/clinicService';

const router = express.Router();

router.get<{}, MessageResponse>('/clinics/search', middlewares.checkSearchParams, async (req, res) => {

  const clinics = await getAllClinics();

  const name = req.query?.name as string;
  const state = req.query?.state as string;
  const availability = req.query?.availability as string;

  // create object with only search params that came in request
  const conditions = {
    ...(name) && { name },
    ...(state) && { state },
    ...(availability) && { availability },
  };

  const clinicsFiltred = clinics.filter(clinic => {
    return Object.keys(conditions).every(key => {
      if (key === 'name' || key === 'state') {
        return clinic[key].toLowerCase().includes(conditions[key]);
      } else {
        return false; //TODO
      }
    });

  });


  res.json({
    data: clinicsFiltred,
  });
});


export default router;

import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import * as middlewares from '../middlewares';
import { getAllClinics } from '../services/clinicService';

const router = express.Router();

router.get<{}, MessageResponse>('/clinics/search', middlewares.checkSearchParams, async (req, res) => {

  const clinics = await getAllClinics();
  const nameParam = req.query?.name;

  const clinicsFiltred = clinics.filter(clinic => {
    let hasName = false;  
    if (nameParam) {
      hasName = clinic.name.toLowerCase().includes(nameParam);
    }

    return hasName;

  });


  res.json({
    data: clinicsFiltred,
  });
});


export default router;

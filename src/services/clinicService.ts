import axios from 'axios';
import { dental as dummyDental, vet as dummyVet } from '../../test/dummyData';

type VetList = typeof dummyVet;
type DentalList = typeof dummyDental;


export async function getAllClinics() {

  let vetResponse: VetList = [];
  let dentalResponse: DentalList = [];

  // I`m using Axios insted fetch API because of simplicity of mock responses in Axios
  await Promise.all([
    axios.get<VetList>('https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json').then(resp => resp.data),
    axios.get<DentalList>('https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json').then(resp => resp.data),
  ]).then(results => {
    vetResponse = results[0];
    dentalResponse = results[1];
  });


  const vet = vetResponse;
  const dental = dentalResponse;

  const allClinics = [...vet, ...dental];
  const allClinicsNormalized = allClinics.map((clinic: any) => {
    return {
      name: clinic.name ?? clinic.clinicName,
      state: clinic.stateCode ?? clinic.stateName,
      availability: clinic.opening ?? clinic.availability,
    };
  });
  return allClinicsNormalized;
}


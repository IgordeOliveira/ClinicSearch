import axios from 'axios';
import dayjs from 'dayjs';
import { dental as dummyDental, vet as dummyVet } from '../../test/dummyData';
import objectSupport from 'dayjs/plugin/objectSupport';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
type VetList = typeof dummyVet;
type DentalList = typeof dummyDental;
type AvailabilityType = {
  from: string,
  to: string,
};

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

export function isOpen(availability: AvailabilityType, from: string, to: string) {
  /* DAY JS CONFIG */
  dayjs.extend(objectSupport);
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);
  /* ------------ */

  // transform clinic availability into dayjs dates 
  const [clinicFromHour, clinicFromMinute] = availability.from.split(':');
  const [clinicToHour, clinicToMinute] = availability.to.split(':');
  const clinicFromDate = dayjs({ hour: clinicFromHour, minute: clinicFromMinute });
  const clinicToDate = dayjs({ hour: clinicToHour, minute: clinicToMinute });

  let isAfterOpen = false;
  let isBeforeClose = false;
  if (from) {
    const [fromHour, fromMinute] = from.split(':');
    const fromDate = dayjs({ hour: parseInt(fromHour), minute: parseInt(fromMinute) });

    if (fromDate.isSameOrAfter(clinicFromDate)) {
      isAfterOpen = true;
    }
  }

  if (to) {
    const [toHour, toMinute] = to.split(':');
    const toDate = dayjs({ hour: parseInt(toHour), minute: parseInt(toMinute) });

    if (toDate.isSameOrBefore(clinicToDate)) {
      isBeforeClose = true;
    }

  }
  return isAfterOpen && isBeforeClose;
}


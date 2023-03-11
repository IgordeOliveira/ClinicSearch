export async function getAllClinics() {
  const vetResponse = await fetch('https://storage.googleapis.com/scratchpay-code-challenge/vet-clinics.json').then(response => response);
  const dentalResponse = await fetch('https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json').then(response => response);

  const vet = await vetResponse.json();
  const dental = await dentalResponse.json();

  const allClinics = [...vet, ...dental];
  const allClinicsNormalized = allClinics.map(clinic => {
    return {
      name: clinic.name ?? clinic.clinicName,
      state: clinic.stateCode ?? clinic.stateName,
      availability: clinic.opening ?? clinic.availability,
    };
  });
  return allClinicsNormalized;
}


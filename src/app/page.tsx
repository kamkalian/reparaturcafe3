import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="w-2/3">
      <Suspense fallback={<div>Loading... </div>}>
      <h1 className="text-6xl font-bold my-10 py-10">Hallo,</h1>
      <p className="text-xl mb-10">dies ist die Webanwendung und Datenbank vom ReparaturCafé der AWO Oberlar.</p>
      <p className="text-xl mb-10">
          <span className="font-bold">Du arbeitest im ReparaturCafé mit?</span><br></br>
          Dann kannst du diese Anwendung zur Organisation der Geräte und für die Dokumentation der Arbeiten nutzen.<br />
      </p>
      <p className="text-xl mb-10">
          <span className="font-bold">Was ist das ReparaturCafé?</span><br></br>
          Das ReparaturCafé ist eine Veranstaltung bei der z.B. Haushaltsgeräte repariert werden. Unser ehrenamtliches Team verfügt über jahrelange Erfahrung und hilft gerne bei der Reparatur von so manch altem Schätzchen.<br />
      </p>      
      </Suspense>
    </div>
  );
}
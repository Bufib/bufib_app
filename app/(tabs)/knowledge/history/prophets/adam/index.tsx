import React from "react";
import ProphetText from "@/components/ProphetText";

const index = () => {
  const textContent = `
  ## **Allgemeine Angaben**
  - Name: Adam (a.)
  - Arabisch: آدم
  - Beiname: „Vater der Menschheit“ [abul-baschar]
  <br />
  
  ## **Schöpfung und Stellung**
  - Erster Mensch, erster Gesandter [rasul] und zugleich Prophet im Islam.
  - Körper erschaffen aus Lehm, einer Mischung aus Wasser und Erde.
  - Seele und Geist wurden ihm von Allah (swt.) eingehaucht.
  - Von  Allah (swt.) als Kalif auf Erden erwählt.
  <br />

  ## **Leben im Paradies und auf Erden**
  - Zusammen mit Eva (a.) im Paradies.
  - Beide aßen durch Satans Verführung vom verbotenen Baum.
  - Folge: Schamgefühl und Beginn der Prüfung der Seele auf Erden.
  - Abstieg auf die Erde [ardh] gemäß Allah (swt.) Befehl.
  <br />

  ## **Wissen und Besonderheiten**
  - Adam kannte besondere Namen, die seine Überlegenheit gegenüber Engeln zeigen.
  - Mystiker sahen eine Verbindung zwischen Adam (a.) und dem Ritualgebet: Bewegungen des Gebets ähneln den Buchstaben "alif" (Stehen), "dal" (Verneigung) und "mim"(Niederwerfung), die zusammen den Namen „Adam“ ergeben.
  <br />

  ## **Religiöse Bauten und Orte**
  - Errichtete das erste Gebetshaus der Menschheit in Mekka.
  - Später von Abraham (a.) wiederaufgebaut (Quran 3:96).
  - Erste Begegnung mit Eva (a.) auf der Erde am Berg Arafat.
  - Verschiedene Orte beanspruchen sein Grab zu beherbergen: nach Überlieferungen der Ahl-ul-Bait (a.) liegt es im Mausoleum von Imam Ali in Nadschaf.
  <br />

## **Nachkommen**
  - Kinder: Kain und Abel, Symbole für das Gute und Schlechte im Menschen.
  - Sohn Seth gilt in manchen Überlieferungen ebenfalls als Prophet.
  <br />
  `;
  return <ProphetText title="Prophet Adam (a.)" textContent={textContent} prophetID={"adam"}/>;
};

export default index;

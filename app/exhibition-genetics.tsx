"use client";

import { formatAnimalPercentile, hasAnimalValue } from "../lib/animal-display";
import { exhibitionPedigreeBranches, resolveExhibitionGenetics, type ExhibitionAnimal, type ExhibitionPedigreeMember, type ExhibitionResult } from "../lib/exhibitions";

type Props = { result: ExhibitionResult; animal?: ExhibitionAnimal };
const dateLabel = (date: string) => date.split("-").reverse().join("/");

function Ancestor({ label, member }: { label: string; member: ExhibitionPedigreeMember }) {
  return <div className="expoAncestor"><small>{label}</small><strong>{member.name}</strong>{hasAnimalValue(member.registration) && <span>HBU {member.registration}</span>}</div>;
}

export function ExhibitionGeneticsView({ result, animal }: Props) {
  const genetics = resolveExhibitionGenetics(result, animal);
  const branches = exhibitionPedigreeBranches(genetics.pedigree);
  const hasPrecision = genetics.deps.some(dep => hasAnimalValue(dep.precision));
  const hasPercentile = genetics.deps.some(dep => hasAnimalValue(dep.percentile));
  if (!branches.length && !genetics.deps.length && !genetics.registration && !genetics.birthDate) return null;
  return <details className="expoGenetics" open={result.champion}>
    <summary>{branches.length ? genetics.deps.length ? "Pedigree y DEPs" : "Pedigree" : genetics.deps.length ? "DEPs y datos del ejemplar" : "Datos del ejemplar"}<span aria-hidden="true">＋</span></summary>
    <div className="expoGeneticsBody">
      {(genetics.registration || genetics.birthDate) && <dl className="expoGeneticsIdentity">{genetics.registration && <div><dt>HBU</dt><dd>{genetics.registration}</dd></div>}{genetics.birthDate && <div><dt>Nacimiento</dt><dd><time dateTime={genetics.birthDate}>{dateLabel(genetics.birthDate)}</time></dd></div>}</dl>}
      {branches.length > 0 && <section className="expoPedigree" aria-label={`Pedigree de ${result.name}`}>
        <h4>Pedigree</h4>
        <div className="expoPedigreeTree">
          <div className="expoPedigreeRoot"><Ancestor label="Ejemplar" member={{ relation: "self", name: result.name, registration: genetics.registration }} /></div>
          <div className={`expoPedigreeBranches ${branches.length > 1 ? "expoTwoBranches" : ""}`}>
            {branches.map(branch => <div className={`expoPedigreeBranch ${branch.parent && branch.ancestors.length ? "expoConnectedAncestors" : ""}`} key={branch.relation}>
              {branch.parent ? <Ancestor label={branch.label} member={branch.parent} /> : <p className="expoMissingParent">Rama {branch.relation === "sire" ? "paterna" : "materna"}</p>}
              {branch.ancestors.length > 0 && <div className={`expoAncestors ${branch.ancestors.length > 1 ? "expoTwoAncestors" : ""}`}>{branch.ancestors.map(member => <Ancestor key={member.relation} label={member.label} member={member} />)}</div>}
            </div>)}
          </div>
        </div>
      </section>}
      {genetics.deps.length > 0 && <section className="expoDeps" aria-label={`DEPs de ${result.name}`}>
        <h4>Evaluación genética · DEPs</h4>
        <p>{result.depsSource === "manual" ? "Datos de esta participación" : "Datos actuales de la ficha del catálogo"}{genetics.evaluationDate && <> · Evaluación del <time dateTime={genetics.evaluationDate}>{dateLabel(genetics.evaluationDate)}</time></>}</p>
        {/* Keyboard focus is needed to scroll a wide table without a mouse. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="expoDepsScroll" role="region" aria-label="Tabla de DEPs, desplazable horizontalmente" tabIndex={0}>
          <table><caption className="expoSrOnly">Diferencias esperadas en la progenie de {result.name}</caption><thead><tr><th scope="col">Indicador</th>{genetics.deps.map((dep, index) => <th scope="col" key={index}>{dep.label}</th>)}</tr></thead><tbody>
            <tr><th scope="row">DEP</th>{genetics.deps.map((dep, index) => <td key={index}>{dep.value}</td>)}</tr>
            {hasPrecision && <tr><th scope="row">Precisión</th>{genetics.deps.map((dep, index) => <td key={index}>{hasAnimalValue(dep.precision) ? dep.precision : <span aria-label="Sin dato">—</span>}</td>)}</tr>}
            {hasPercentile && <tr><th scope="row">Percentil</th>{genetics.deps.map((dep, index) => <td key={index}>{hasAnimalValue(dep.percentile) ? <span className="expoTop">{formatAnimalPercentile(dep.percentile)}</span> : <span aria-label="Sin dato">—</span>}</td>)}</tr>}
          </tbody></table>
        </div>
      </section>}
    </div>
  </details>;
}

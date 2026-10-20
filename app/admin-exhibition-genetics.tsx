"use client";

import { formatAnimalPercentile } from "../lib/animal-display";
import { exhibitionCatalogGenetics, exhibitionPedigreeRelations, type ExhibitionAnimal, type ExhibitionDep, type ExhibitionPedigreeMember, type ExhibitionResult } from "../lib/exhibitions";

type Props = { result: ExhibitionResult; animal?: ExhibitionAnimal };

export function ExhibitionGeneticsEditor({ result, animal, change }: Props & { change: (values: Partial<ExhibitionResult>) => void }) {
  const catalog = exhibitionCatalogGenetics(animal);
  const updateAncestor = (relation: string, values: Partial<ExhibitionPedigreeMember>) => {
    const previous = result.pedigree.find(member => member.relation === relation);
    change({ pedigree: [...result.pedigree.filter(member => member.relation !== relation), { relation, name: "", ...previous, ...values }] });
  };
  const updateDep = (index: number, values: Partial<ExhibitionDep>) => change({ deps: result.deps.map((dep, position) => position === index ? { ...dep, ...values } : dep) });
  return <fieldset className="expoGeneticsEditor">
    <legend>Pedigree y evaluación genética</legend>
    <p className="expoHint">Tomá los datos actuales de la ficha vinculada o cargá una copia histórica para esta exposición. Los datos vacíos no se muestran.</p>
    <div className="expoFields">
      <label>HBU del ejemplar<input value={result.registration} placeholder={catalog.registration || "Opcional"} onChange={e => change({ registration: e.target.value })} /><small>Sin completar, usa el HBU de la ficha publicada.</small></label>
      <label>Fecha de nacimiento<input type="date" value={result.birthDate} onChange={e => change({ birthDate: e.target.value })} /><small>Sin completar, usa la fecha de la ficha publicada.</small></label>
    </div>
    <section className="expoGeneticsEditorSection">
      <label className="expoCheck"><input type="checkbox" checked={result.showPedigree} onChange={e => change({ showPedigree: e.target.checked })} /> Mostrar pedigree</label>
      {result.showPedigree && <>
        <label className="expoGeneticsSource">Origen del pedigree<select value={result.pedigreeSource} onChange={e => change({ pedigreeSource: e.target.value === "catalog" ? "catalog" : "manual" })}><option value="manual">Cargar pedigree de esta exposición</option><option value="catalog" disabled={!animal}>Usar pedigree actual del catálogo</option></select></label>
        {result.pedigreeSource === "catalog" ? <p className="expoHint">{animal ? `Se usarán los ascendientes de ${animal.name}. Si modificás su ficha, se actualizarán también aquí. Solo serán públicos si la ficha está publicada.` : "Vinculá una ficha o elegí cargar el pedigree de esta exposición."}</p> : <>
          {animal && <button className="expoGeneticsCopy" type="button" onClick={() => change({ pedigree: catalog.pedigree, registration: result.registration || catalog.registration, birthDate: result.birthDate || catalog.birthDate })}>Copiar pedigree de la ficha vinculada</button>}
          <div className="expoPedigreeFields">{exhibitionPedigreeRelations.map(([relation, label]) => {
            const member = result.pedigree.find(item => item.relation === relation);
            return <fieldset key={relation}><legend>{label}</legend><label>Nombre<input value={member?.name || ""} onChange={e => updateAncestor(relation, { name: e.target.value })} /></label><label>HBU (opcional)<input value={member?.registration || ""} onChange={e => updateAncestor(relation, { registration: e.target.value })} /></label></fieldset>;
          })}</div>
        </>}
      </>}
    </section>
    <section className="expoGeneticsEditorSection">
      <label className="expoCheck"><input type="checkbox" checked={result.showDeps} onChange={e => change({ showDeps: e.target.checked })} /> Mostrar DEPs</label>
      {result.showDeps && <>
        <label className="expoGeneticsSource">Origen de los DEPs<select value={result.depsSource} onChange={e => change({ depsSource: e.target.value === "catalog" ? "catalog" : "manual" })}><option value="manual">Cargar DEPs de esta exposición (copia histórica)</option><option value="catalog" disabled={!animal}>Usar DEPs actuales del catálogo</option></select></label>
        {result.depsSource === "catalog" ? <p className="expoHint">{animal ? `Se usarán los DEPs actuales de ${animal.name}. Cambiarán cuando actualices su ficha. Para conservar una evaluación de la exposición, elegí copia histórica.` : "Vinculá una ficha o elegí cargar los DEPs de esta exposición."}</p> : <>
          {animal && <button className="expoGeneticsCopy" type="button" onClick={() => change({ deps: catalog.deps })}>Copiar DEPs de la ficha vinculada</button>}
          <label className="expoGeneticsSource">Fecha de la evaluación (opcional)<input type="date" value={result.evaluationDate} onChange={e => change({ evaluationDate: e.target.value })} /></label>
          <p className="expoHint">Indicador y valor para cada DEP. Precisión y percentil son opcionales. Usá el nombre y las unidades de la evaluación original; un valor 0 es válido.</p>
          <div className="expoDepEditors">{result.deps.map((dep, index) => <fieldset key={index}>
            <legend>DEP {index + 1}</legend>
            <label>Indicador<input aria-label={`Indicador DEP ${index + 1}`} value={dep.label} placeholder="Ej. Peso al nacer" onChange={e => updateDep(index, { label: e.target.value })} /></label>
            <label>Valor<input aria-label={`Valor DEP ${index + 1}`} value={dep.value} placeholder="Ej. 0.26" onChange={e => updateDep(index, { value: e.target.value })} /></label>
            <label>Precisión<input aria-label={`Precisión DEP ${index + 1}`} value={dep.precision || ""} placeholder="Ej. 0.42" onChange={e => updateDep(index, { precision: e.target.value })} /></label>
            <label>Percentil<select aria-label={`Percentil DEP ${index + 1}`} value={dep.percentile || ""} onChange={e => updateDep(index, { percentile: e.target.value })}><option value="">No mostrar</option><option value="5">Top 5%</option><option value="20">Top 20%</option>{dep.percentile && !["5", "20"].includes(dep.percentile) && <option value={dep.percentile}>{formatAnimalPercentile(dep.percentile)}</option>}</select></label>
            <button type="button" aria-label={`Quitar DEP ${index + 1}`} onClick={() => change({ deps: result.deps.filter((_, position) => position !== index) })}>Quitar</button>
          </fieldset>)}</div>
          <button className="expoGeneticsCopy" type="button" disabled={result.deps.length >= 40} onClick={() => change({ deps: [...result.deps, { label: "", value: "", precision: "", percentile: "" }] })}>＋ Agregar DEP</button>
        </>}
      </>}
    </section>
  </fieldset>;
}

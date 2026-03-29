import React, { useEffect, useState } from 'react'
import '../App.css'
import { getCar, getExteriors, getWheels, getRoofs, getInteriors, updateCar } from '../services/CarsAPI'
import { calcTotalPrice } from '../utilities/calcPrice'
import { validateCombination } from '../utilities/validate'
import { useParams, useNavigate } from 'react-router-dom'
import AttributeRow from '../components/AttributeRow'

const EditCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [exteriors, setExteriors] = useState([])
    const [wheels, setWheels] = useState([])
    const [roofs, setRoofs] = useState([])
    const [interiors, setInteriors] = useState([])
    const [name, setName] = useState('')
    const [exteriorId, setExteriorId] = useState('')
    const [wheelId, setWheelId] = useState('')
    const [roofId, setRoofId] = useState('')
    const [interiorId, setInteriorId] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        ;(async () => {
            try {
                const [ex, w, rf, ir] = await Promise.all([
                    getExteriors(),
                    getWheels(),
                    getRoofs(),
                    getInteriors(),
                ])
                if (Array.isArray(ex)) setExteriors(ex)
                if (Array.isArray(w)) setWheels(w)
                if (Array.isArray(rf)) setRoofs(rf)
                if (Array.isArray(ir)) setInteriors(ir)
            } catch (err) {
                console.error('load options', err)
            }
            try {
                const c = await getCar(id)
                setCar(c)
            } catch (err) {
                console.error('load car', err)
            }
        })()
    }, [id])

    useEffect(() => {
        if (car) {
            setName(car.name)
            setExteriorId(car.exterior_id ?? '')
            setWheelId(car.wheel_id ?? '')
            setRoofId(car.roof_id ?? '')
            setInteriorId(car.interior_id ?? '')
            setNotes(car.notes || '')
        }
    }, [car])

    if (!car) return <div className='page edit customize-page'>Loading…</div>

    const selectedExterior = exteriors.find(e => String(e.id) === String(exteriorId))
    const selectedWheel = wheels.find(w => String(w.id) === String(wheelId))
    const selectedRoof = roofs.find(r => String(r.id) === String(roofId))
    const selectedInterior = interiors.find(i => String(i.id) === String(interiorId))

    const totalPrice = calcTotalPrice(selectedExterior, selectedWheel, selectedRoof, selectedInterior)

    async function handleSave(e) {
        e.preventDefault()
        const valid = validateCombination({
            exterior: selectedExterior,
            wheel: selectedWheel,
            roof: selectedRoof,
            interior: selectedInterior,
        })
        if (!valid.ok) return alert(valid.error)
        await updateCar(id, {
            name,
            exterior_id: exteriorId,
            wheel_id: wheelId,
            roof_id: roofId,
            interior_id: interiorId,
            notes,
            price: totalPrice,
        })
        navigate(`/customcars/${id}`)
    }

    return (
        <div className='page edit customize-page'>
            <header className='car-list-header'>
                <div>
                    <h2>Edit Car</h2>
                    <p className='car-list-subtitle'>Choose one option per row — selection is highlighted</p>
                </div>
            </header>

            <form onSubmit={handleSave}>
                <div className='customize-field'>
                    <label htmlFor='edit-car-name'>Name</label>
                    <input id='edit-car-name' value={name} onChange={e => setName(e.target.value)} />
                </div>

                <AttributeRow
                    label='Exterior'
                    options={exteriors}
                    selectedId={exteriorId}
                    onSelect={setExteriorId}
                />

                <AttributeRow
                    label='Wheels'
                    options={wheels}
                    selectedId={wheelId}
                    onSelect={setWheelId}
                />

                <AttributeRow
                    label='Roof'
                    options={roofs}
                    selectedId={roofId}
                    onSelect={setRoofId}
                />

                <AttributeRow
                    label='Interior'
                    options={interiors}
                    selectedId={interiorId}
                    onSelect={setInteriorId}
                />

                <div className='customize-field'>
                    <label htmlFor='edit-car-notes'>Notes</label>
                    <textarea id='edit-car-notes' value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                </div>

                <div className='customize-total-bar'>
                    <span>Total build price</span>
                    <strong>${Number(totalPrice || 0).toLocaleString()}</strong>
                </div>

                <button type='submit' className='customize-submit'>
                    Save changes
                </button>
            </form>
        </div>
    )
}

export default EditCar

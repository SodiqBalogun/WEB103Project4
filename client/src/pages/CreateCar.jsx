import React, { useEffect, useState } from 'react'
import '../App.css'
import { getExteriors, getWheels, getRoofs, getInteriors, createCar } from '../services/CarsAPI'
import { calcTotalPrice } from '../utilities/calcPrice'
import { validateCombination } from '../utilities/validate'
import { useNavigate } from 'react-router-dom'
import AttributeRow from '../components/AttributeRow'

const CreateCar = () => {
    const [exteriors, setExteriors] = useState([])
    const [wheels, setWheels] = useState([])
    const [roofs, setRoofs] = useState([])
    const [interiors, setInteriors] = useState([])
    const [name, setName] = useState('My Bolt')
    const [exteriorId, setExteriorId] = useState(null)
    const [wheelId, setWheelId] = useState(null)
    const [roofId, setRoofId] = useState(null)
    const [interiorId, setInteriorId] = useState(null)
    const [notes, setNotes] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            try {
                const [ex, wh, rf, ir] = await Promise.all([
                    getExteriors(),
                    getWheels(),
                    getRoofs(),
                    getInteriors(),
                ])
                if (Array.isArray(ex)) setExteriors(ex)
                if (Array.isArray(wh)) setWheels(wh)
                if (Array.isArray(rf)) setRoofs(rf)
                if (Array.isArray(ir)) setInteriors(ir)
            } catch (err) {
                setError('Unable to load options: ' + err.message)
            }
        })()
    }, [])

    const selectedExterior = exteriors.find(e => String(e.id) === String(exteriorId))
    const selectedWheel = wheels.find(w => String(w.id) === String(wheelId))
    const selectedRoof = roofs.find(r => String(r.id) === String(roofId))
    const selectedInterior = interiors.find(i => String(i.id) === String(interiorId))

    const totalPrice = calcTotalPrice(selectedExterior, selectedWheel, selectedRoof, selectedInterior)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        const valid = validateCombination({
            exterior: selectedExterior,
            wheel: selectedWheel,
            roof: selectedRoof,
            interior: selectedInterior,
        })
        if (!valid.ok) return setError(valid.error)

        const payload = {
            name,
            exterior_id: exteriorId,
            wheel_id: wheelId,
            roof_id: roofId,
            interior_id: interiorId,
            notes,
            price: totalPrice,
        }

        try {
            await createCar(payload)
            navigate('/customcars')
        } catch (err) {
            setError(err.message || 'unable to create')
        }
    }

    return (
        <div className='page create customize-page'>
            <header className='car-list-header'>
                <div>
                    <h2>Create Custom Car</h2>
                    <p className='car-list-subtitle'>Tap an image in each row to choose your build</p>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <div className='customize-field'>
                    <label htmlFor='car-name'>Name</label>
                    <input id='car-name' value={name} onChange={e => setName(e.target.value)} />
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
                    <label htmlFor='car-notes'>Notes</label>
                    <textarea id='car-notes' value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
                </div>

                <div className='customize-total-bar'>
                    <span>Total build price</span>
                    <strong>${Number(totalPrice || 0).toLocaleString()}</strong>
                </div>

                {error && <div className='error'>{error}</div>}

                <button type='submit' className='customize-submit'>
                    Create car
                </button>
            </form>
        </div>
    )
}

export default CreateCar

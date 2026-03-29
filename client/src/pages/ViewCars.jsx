import React, { useEffect, useState } from 'react'
import '../App.css'
import {
    getAllCars,
    deleteCar,
    getExteriors,
    getWheels,
    getRoofs,
    getInteriors,
} from '../services/CarsAPI'
import { Link, useNavigate } from 'react-router-dom'

function pickName(rows, id) {
    if (id == null || id === '') return '—'
    const row = rows.find(r => String(r.id) === String(id))
    return row ? row.name : '—'
}

function pickImage(rows, id) {
    if (id == null || id === '') return null
    const row = rows.find(r => String(r.id) === String(id))
    return row?.image_url || null
}

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [exteriors, setExteriors] = useState([])
    const [wheels, setWheels] = useState([])
    const [roofs, setRoofs] = useState([])
    const [interiors, setInteriors] = useState([])
    const [loadError, setLoadError] = useState(null)
    const navigate = useNavigate()

    async function refresh() {
        setLoadError(null)
        const [rows, ex, wh, rf, ir] = await Promise.all([
            getAllCars(),
            getExteriors(),
            getWheels(),
            getRoofs(),
            getInteriors(),
        ])
        setCars(Array.isArray(rows) ? rows : [])
        if (Array.isArray(ex)) setExteriors(ex)
        if (Array.isArray(wh)) setWheels(wh)
        if (Array.isArray(rf)) setRoofs(rf)
        if (Array.isArray(ir)) setInteriors(ir)
    }

    useEffect(() => {
        ;(async () => {
            try {
                await refresh()
            } catch (err) {
                console.error('load cars', err)
                setLoadError(err.message || 'Unable to load cars')
            }
        })()
    }, [])

    async function handleDelete(id, e) {
        e.preventDefault()
        e.stopPropagation()
        if (!window.confirm('Delete this custom car?')) return
        await deleteCar(id)
        refresh()
    }

    return (
        <div className='page list car-list-page'>
            <header className='car-list-header'>
                <div>
                    <h2>Custom Cars</h2>
                    <p className='car-list-subtitle'>
                        {cars.length} build{cars.length === 1 ? '' : 's'} saved — specs at a glance
                    </p>
                </div>
                
            </header>

            {loadError && <div className='car-list-error'>{loadError}</div>}

            {cars.length === 0 && !loadError ? (
                <div className='car-list-empty'>
                    <p>No custom cars yet.</p>
                    <button type='button' className='car-list-primary' onClick={() => navigate('/')}>
                        Build your first
                    </button>
                </div>
            ) : (
                <div className='car-grid'>
                    {cars.map(c => {
                        const exteriorImg = pickImage(exteriors, c.exterior_id)
                        return (
                            <article key={c.id} className='car-card'>
                                <Link to={`/customcars/${c.id}`} className='car-card-link'>
                                    <div className='car-card-visual'>
                                        {exteriorImg ? (
                                            <img src={exteriorImg} alt='' />
                                        ) : (
                                            <div className='car-card-visual-placeholder'>No preview</div>
                                        )}
                                    </div>
                                    <div className='car-card-body'>
                                        <h3 className='car-card-title'>{c.name}</h3>
                                        <p className='car-card-price'>
                                            ${Number(c.price || 0).toLocaleString()}
                                        </p>
                                        <dl className='car-card-specs'>
                                            <div>
                                                <dt>Exterior</dt>
                                                <dd>{pickName(exteriors, c.exterior_id)}</dd>
                                            </div>
                                            <div>
                                                <dt>Wheels</dt>
                                                <dd>{pickName(wheels, c.wheel_id)}</dd>
                                            </div>
                                            <div>
                                                <dt>Roof</dt>
                                                <dd>{pickName(roofs, c.roof_id)}</dd>
                                            </div>
                                            <div>
                                                <dt>Interior</dt>
                                                <dd>{pickName(interiors, c.interior_id)}</dd>
                                            </div>
                                        </dl>
                                        {c.notes ? (
                                            <p className='car-card-notes' title={c.notes}>
                                                {c.notes}
                                            </p>
                                        ) : (
                                            <p className='car-card-notes car-card-notes--empty'>No notes</p>
                                        )}
                                    </div>
                                </Link>
                                <footer className='car-card-actions'>
                                    <Link to={`/edit/${c.id}`} className='car-card-btn car-card-btn--secondary'>
                                        Edit
                                    </Link>
                                    <button
                                        type='button'
                                        className='car-card-btn car-card-btn--danger'
                                        onClick={e => handleDelete(c.id, e)}
                                    >
                                        Delete
                                    </button>
                                </footer>
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ViewCars

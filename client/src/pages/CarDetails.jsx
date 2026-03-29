import React, { useEffect, useState } from 'react'
import '../App.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getCar, getExteriors, getWheels, getRoofs, getInteriors, deleteCar } from '../services/CarsAPI'
function formatMoney(n) {
    const x = Number(n || 0)
    return x.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatDate(iso) {
    if (!iso) return null
    try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return null
        return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
    } catch {
        return null
    }
}

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [exteriors, setExteriors] = useState([])
    const [wheels, setWheels] = useState([])
    const [roofs, setRoofs] = useState([])
    const [interiors, setInteriors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            setLoading(true)
            setError(null)
            try {
                const [ex, w, rf, ir] = await Promise.all([
                    getExteriors(),
                    getWheels(),
                    getRoofs(),
                    getInteriors(),
                ])
                if (cancelled) return
                if (Array.isArray(ex)) setExteriors(ex)
                if (Array.isArray(w)) setWheels(w)
                if (Array.isArray(rf)) setRoofs(rf)
                if (Array.isArray(ir)) setInteriors(ir)

                const c = await getCar(id)
                if (!cancelled) setCar(c)
            } catch (err) {
                console.error('load car detail', err)
                if (!cancelled) setError(err.message || 'Unable to load this build')
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [id])

    if (loading) {
        return (
            <div className='car-detail-page'>
                <div className='car-detail-loading'>Loading build…</div>
            </div>
        )
    }

    if (error || !car) {
        return (
            <div className='car-detail-page'>
                <div className='car-detail-error'>
                    <h2>{error || 'Car not found'}</h2>
                    <p>
                        <Link to='/customcars'>← Back to all cars</Link>
                    </p>
                </div>
            </div>
        )
    }

    const exterior = exteriors.find(e => String(e.id) === String(car.exterior_id))
    const wheel = wheels.find(w => String(w.id) === String(car.wheel_id))
    const roof = roofs.find(r => String(r.id) === String(car.roof_id))
    const interior = interiors.find(i => String(i.id) === String(car.interior_id))

    const storedPrice = Number(car.price || 0)

    const featureTiles = [
        { label: 'Exterior', item: exterior },
        { label: 'Wheels', item: wheel },
        { label: 'Roof', item: roof },
        { label: 'Interior', item: interior },
    ]

    const createdLabel = formatDate(car.created_at)

    async function handleDelete() {
        if (!window.confirm('Delete this custom car? This cannot be undone.')) return
        await deleteCar(car.id)
        navigate('/customcars')
    }

    return (
        <div className='car-detail-page'>

            <header className='car-detail-hero'>
                <div className='car-detail-hero-visual'>
                    {exterior?.image_url ? (
                        <img src={exterior.image_url} alt='' />
                    ) : (
                        <div className='car-detail-hero-placeholder'>No exterior preview</div>
                    )}
                </div>
                <div className='car-detail-hero-copy'>
                    <h1 className='car-detail-title'>{car.name}</h1>
                    <p className='car-detail-price'>
                        <span className='car-detail-price-label'>Total</span>
                        <span className='car-detail-price-value'>${formatMoney(storedPrice)}</span>
                    </p>
                    {createdLabel && (
                        <p className='car-detail-meta'>Saved on {createdLabel}</p>
                    )}
                    <div className='car-detail-hero-actions'>
                        <button
                            type='button'
                            className='car-detail-btn car-detail-btn--primary'
                            onClick={() => navigate(`/edit/${car.id}`)}
                        >
                            Edit build
                        </button>
                        <button type='button' className='car-detail-btn car-detail-btn--ghost' onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </header>

            <section className='car-detail-section' aria-labelledby='features-heading'>
                <h2 id='features-heading' className='car-detail-section-title'>
                    Configuration
                </h2>
                <div className='car-detail-features'>
                    {featureTiles.map(({ label, item }) => (
                        <div key={label} className={`car-detail-feature${item ? '' : ' car-detail-feature--missing'}`}>
                            <div className='car-detail-feature-visual'>
                                {item?.image_url ? (
                                    <img src={item.image_url} alt='' />
                                ) : (
                                    <span className='car-detail-feature-fallback'>—</span>
                                )}
                            </div>
                            <div className='car-detail-feature-text'>
                                <span className='car-detail-feature-label'>{label}</span>
                                <span className='car-detail-feature-name'>{item ? item.name : 'Not set'}</span>
                                {item && (
                                    <span className='car-detail-feature-price'>+${formatMoney(item.price)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <p className='car-detail-config-footnote'>
                    Amounts are per-option add-ons. Saved build total: <strong>${formatMoney(storedPrice)}</strong>.
                </p>
            </section>

            <section className='car-detail-section car-detail-notes-section' aria-labelledby='notes-heading'>
                <h2 id='notes-heading' className='car-detail-section-title'>
                    Notes
                </h2>
                <div className='car-detail-notes-card'>
                    {car.notes ? car.notes : <span className='car-detail-notes-empty'>No notes for this build.</span>}
                </div>
            </section>
        </div>
    )
}

export default CarDetails

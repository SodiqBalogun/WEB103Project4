import React, { useState } from 'react'

function formatPrice(n) {
    const x = Number(n || 0)
    return x.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function OptionTile({ opt, isSelected, onSelect }) {
    const [imgFailed, setImgFailed] = useState(!opt.image_url)

    return (
        <button
            type='button'
            role='radio'
            aria-checked={isSelected}
            className={`customize-option${isSelected ? ' customize-option--selected' : ''}`}
            onClick={() => onSelect(opt.id)}
        >
            <span className='customize-option-image'>
                {!imgFailed && opt.image_url ? (
                    <img src={opt.image_url} alt='' loading='lazy' onError={() => setImgFailed(true)} />
                ) : (
                    <span className='customize-option-fallback' aria-hidden>
                        {(opt.name || '?').slice(0, 2)}
                    </span>
                )}
            </span>
            <span className='customize-option-meta'>
                <span className='customize-option-name'>{opt.name}</span>
                <span className='customize-option-price'>+${formatPrice(opt.price)}</span>
            </span>
            {isSelected && (
                <span className='customize-option-check' aria-hidden>
                    ✓
                </span>
            )}
        </button>
    )
}

/**
 * One customization category: a labeled row of image tiles (pick one).
 */
export default function AttributeRow({ label, options, selectedId, onSelect }) {
    const safeOptions = Array.isArray(options) ? options : []
    const headingId = `customize-${String(label).replace(/\s+/g, '-')}`

    return (
        <section className='customize-row' aria-labelledby={headingId}>
            <h3 className='customize-row-title' id={headingId}>
                {label}
            </h3>
            <div className='customize-row-track' role='radiogroup' aria-label={label}>
                {safeOptions.map(opt => (
                    <OptionTile
                        key={opt.id}
                        opt={opt}
                        isSelected={selectedId != null && String(selectedId) === String(opt.id)}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </section>
    )
}

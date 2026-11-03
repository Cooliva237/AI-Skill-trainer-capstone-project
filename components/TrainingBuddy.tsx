/** Original plate character drawn as editable vectors. Decorative, not a coach. */
export function TrainingBuddy({ hero = false }: { hero?: boolean }) {
  return <svg className={`buddy-art ${hero ? 'hero-buddy' : ''}`} viewBox="0 0 260 245" role="img" aria-label="A smiling blue weight plate waving hello">
    <ellipse cx="132" cy="222" rx="76" ry="8" fill="#e8d8ad" />
    <g stroke="#26221e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m101 174-8 36-22 5q-6 8 9 9h27l12-43m35-6 12 36 21 5q5 8-8 8h-27l-16-43" fill="#ef514b" />
      <path d="M67 123q-28 5-29-22l-2-19q-1-10-6-8-7 2-1 16l-8-8q-8-4-7 3l9 14q-18-4-14 4l16 10q3 40 43 33" fill="#f5c547" />
      <path d="M191 125q24-7 27-33l2-11q3-8 8-2l-1 11 10-8q9-1 4 7l-10 9 11-2q9 4 0 9l-12 5q-7 32-37 37" fill="#ef514b" />
      <ellipse cx="132" cy="126" rx="80" ry="83" fill="#244675" />
      <ellipse cx="128" cy="115" rx="79" ry="81" fill="#3268bd" />
      <ellipse cx="128" cy="115" rx="65" ry="67" fill="none" stroke="#193b70" strokeWidth="3" />
      <path d="M64 153q53 51 118 7" fill="none" stroke="#f5c547" strokeWidth="9" />
      <path d="M76 65q15-13 28-14" fill="none" stroke="#78a3e0" strokeWidth="7" />
      <path d="m100 90 12-3m37 0 12 4" fill="none" strokeWidth="4" />
      <ellipse cx="108" cy="109" rx="5" ry="8" fill="#26221e" stroke="none" /><ellipse cx="155" cy="109" rx="5" ry="8" fill="#26221e" stroke="none" />
      <path d="M113 132q19 22 40-3-19-7-40 3" fill="#fff7df" strokeWidth="4" />
      <path d="m42 45-6-12m16 9 4-11m150 21 10-6" fill="none" strokeWidth="4" />
    </g>
  </svg>;
}

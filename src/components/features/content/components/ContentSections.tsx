export function ContentSections({ sections }: { sections: { heading: string; body: string[] }[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink-950 md:text-xl">
            {section.heading}
          </h2>
          {section.body.map((para, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed text-ink-600 md:text-base">
              {para}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
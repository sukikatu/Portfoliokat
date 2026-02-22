interface PhoneMockupProps {
  variant: 'dark' | 'light';
}

export default function PhoneMockup({ variant }: PhoneMockupProps) {
  const isDark = variant === 'dark';

  return (
    <div className="relative mx-auto" style={{ width: 240, height: 480 }}>
      <div
        className={`absolute inset-0 rounded-[36px] ${
          isDark ? 'bg-neutral-900' : 'bg-white'
        } shadow-2xl border ${isDark ? 'border-neutral-800' : 'border-neutral-200'} overflow-hidden`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl" />

        <div className="p-5 pt-10 h-full flex flex-col">
          {isDark ? (
            <>
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-neutral-700" />
                <div className="flex-1">
                  <div className="h-2 bg-neutral-700 rounded w-20 mb-1.5" />
                  <div className="h-1.5 bg-neutral-800 rounded w-14" />
                </div>
              </div>

              <div className="bg-orange-400 rounded-2xl p-4 mb-4 flex-shrink-0">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-2 bg-orange-300 rounded w-16" />
                  <div className="w-6 h-4 bg-orange-300 rounded" />
                </div>
                <div className="h-2 bg-orange-300/60 rounded w-32 mb-1.5" />
                <div className="h-1.5 bg-orange-300/40 rounded w-20" />
              </div>

              <div className="space-y-3 flex-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-neutral-800" />
                    <div className="flex-1">
                      <div className="h-2 bg-neutral-700 rounded w-full mb-1" />
                      <div className="h-1.5 bg-neutral-800 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-around mt-auto pt-3 border-t border-neutral-800">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-5 h-5 rounded bg-neutral-800" />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-mint-200 flex items-center justify-center">
                  <div className="w-3 h-3 rounded bg-mint-400" />
                </div>
                <div className="h-2 bg-neutral-200 rounded w-16" />
              </div>

              <div className="bg-neutral-100 rounded-2xl p-4 mb-3 flex-1">
                <div className="h-2 bg-neutral-300 rounded w-20 mb-3" />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="h-16 bg-white rounded-xl" />
                  <div className="h-16 bg-white rounded-xl" />
                </div>
                <div className="h-2 bg-neutral-200 rounded w-full mb-1.5" />
                <div className="h-2 bg-neutral-200 rounded w-3/4" />
              </div>

              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-charcoal rounded-lg" />
                <div className="w-8 h-8 bg-neutral-200 rounded-lg" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

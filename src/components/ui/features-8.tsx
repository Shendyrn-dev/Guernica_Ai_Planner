import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, FileText, Workflow } from 'lucide-react'

export function Features() {
    return (
        <section className="bg-transparent py-16 md:py-24">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden bg-white dark:bg-black border-0 lg:col-span-2">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <svg className="text-neutral-300 dark:text-neutral-700 absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor" />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-semibold tracking-tight">16</span>
                                </div>
                                <h2 className="mt-6 text-center text-xl font-semibold tracking-tight">PRD Terstruktur</h2>
                                <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">16 sections siap tempel — Goals, Roles, Flows.</p>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden bg-white dark:bg-black border-0 sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full before:absolute before:-inset-2 before:rounded-full before:border dark:before:border-white/10">
                                    <Workflow className="m-auto size-6" strokeWidth={1.2} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium">Spec Lengkap</h2>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Feature spec, DB, API — tidak menebak.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden bg-white dark:bg-black border-0 sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="pt-6 lg:px-6">
                                    <svg className="w-full text-black dark:text-white" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="386" height="123" rx="10" fill="currentColor" opacity="0.06" />
                                        <g clipPath="url(#clip0_0_106)">
                                            <circle cx="29" cy="29" r="15" fill="currentColor" />
                                            <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </g>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123" fill="currentColor" opacity="0.08" />
                                        <path d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605" stroke="currentColor" strokeWidth="2.5" />
                                        <defs>
                                            <clipPath id="clip0_0_106"><rect width="358" height="30" fill="white" transform="translate(14 14)" /></clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-8 space-y-2 text-center">
                                    <h2 className="text-lg font-medium">Tasks Terurut</h2>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">TASK-001… dependensi valid, siap eksekusi.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden bg-black text-white dark:bg-white dark:text-black border-0 lg:col-span-3">
                            <CardContent className="grid pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-8">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-white/20 dark:border-black/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/10 dark:before:border-black/5">
                                        <Shield className="m-auto size-5" strokeWidth={1.2} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium">Stack Respect</h2>
                                        <p className="text-sm opacity-70">AI tidak ganti Next.js/FastAPI tanpa alasan.</p>
                                    </div>
                                </div>
                                <div className="relative -mb-6 -mr-6 mt-6 flex items-center justify-center border-t border-white/10 dark:border-black/10 p-6 sm:ml-6 sm:border-l sm:border-t-0">
                                    <div className="text-center">
                                        <div className="font-mono text-xs opacity-60">IDE → CLARIFY → PRD</div>
                                        <div className="mt-2 font-mono text-sm font-medium">→ SPEC → TASK → PROMPT</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden bg-white dark:bg-black border-0 lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-8">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Users className="m-auto size-5" strokeWidth={1.2} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium">Tim Sinkron</h2>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Founder & dev pakai blueprint yang sama.</p>
                                    </div>
                                </div>
                                <div className="relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px before:bg-neutral-200 dark:before:bg-neutral-800 sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center gap-4 py-6">
                                        <div className="flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="rounded bg-black px-2 py-1 text-xs text-white dark:bg-white dark:text-black">Indie Dev</span>
                                            <img className="size-7 rounded-full object-cover grayscale" src="https://picsum.photos/seed/dev1/56/56" alt="" />
                                        </div>
                                        <div className="ml-[calc(50%-1rem)] flex items-center gap-2">
                                            <img className="size-7 rounded-full object-cover grayscale" src="https://picsum.photos/seed/dev2/56/56" alt="" />
                                            <span className="rounded bg-black px-2 py-1 text-xs text-white dark:bg-white dark:text-black">Mahasiswa</span>
                                        </div>
                                        <div className="flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="rounded bg-black px-2 py-1 text-xs text-white dark:bg-white dark:text-black">Founder</span>
                                            <img className="size-7 rounded-full object-cover grayscale" src="https://picsum.photos/seed/dev3/56/56" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

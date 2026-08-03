# API Documentation — Restaurant Website Backend

Base URL (local): `http://localhost:5000/api/v1`

All responses follow this shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Fetched successfully",
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

Errors:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "A valid email is required" }]
}
```

**Auth:** Send the access token either as an `Authorization: Bearer <token>` header, or rely on the `accessToken` httpOnly cookie automatically set on login (works out of the box with `credentials: 'include'` from the frontend).

**Roles:** `superadmin` > `admin` > `manager` > `staff`. Each route below lists the minimum role required.

---

## Auth — `/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | Log in, returns user + sets cookies |
| POST | `/register` | admin+ | Create a new staff/admin account |
| POST | `/logout` | Any logged in | Clears auth cookies |
| GET | `/me` | Any logged in | Get current user profile |
| POST | `/refresh` | Public (needs refresh cookie) | Get a new access token |
| PATCH | `/update-password` | Any logged in | Change your own password |
| POST | `/forgot-password` | Public | Request a reset token |
| PATCH | `/reset-password/:token` | Public | Reset password with token |

## Users / Staff — `/users`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | admin+ | List staff accounts |
| GET | `/:id` | admin+ | Get one staff account |
| PATCH | `/:id` | admin+ | Update role/profile/active status |
| DELETE | `/:id` | superadmin | Delete a staff account |
| PATCH | `/me/avatar` | Any logged in | Upload/replace your avatar |

## Categories — `/categories`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List categories (`?search=`, `?page=`) |
| GET | `/:id` | Public | Get one category |
| POST | `/` | manager+ | Create (multipart: `image` + fields) |
| PATCH | `/:id` | manager+ | Update |
| DELETE | `/:id` | admin+ | Delete (blocked if items reference it) |

## Menu — `/menu`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List with filters: `category, foodType, branch, available, todaysSpecial, popular, chefRecommended, minPrice, maxPrice, search, sort, page, limit` |
| GET | `/:id` | Public | Get by id or slug |
| POST | `/` | manager+ | Create (multipart: up to 5 `images`) |
| PATCH | `/:id` | manager+ | Update (appends new images) |
| PATCH | `/:id/availability` | staff+ | Quick 86/enable toggle |
| DELETE | `/:id/images/:publicId` | manager+ | Remove one image |
| DELETE | `/:id` | admin+ | Delete item |

## Branches — `/branches`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List (`?city=`, `?active=`) |
| GET | `/nearby?lat=&lng=&maxDistanceKm=` | Public | Geospatial nearest-branch search |
| GET | `/:id` | Public | Get by id or slug |
| GET | `/:id/google-reviews` | Public | Live Google Business Profile rating/reviews |
| POST | `/` | manager+ | Create (multipart: `images[]`, `banner`) |
| PATCH | `/:id` | manager+ | Update |
| DELETE | `/:id/images/:publicId` | manager+ | Remove one image |
| DELETE | `/:id` | admin+ | Delete branch |

## Gallery — `/gallery`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List (`?category=`, `?branch=`, `?featured=`) |
| POST | `/` | manager+ | Upload (multipart: up to 20 `images`) |
| PATCH | `/:id` | manager+ | Update metadata |
| DELETE | `/:id` | manager+ | Delete |

## Reviews (website only — Google is separate) — `/reviews`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Approved reviews only, includes average rating |
| POST | `/` | Public | Submit a review (status starts `pending`) |
| GET | `/admin/all` | manager+ | All reviews, any status |
| PATCH | `/:id/moderate` | manager+ | Approve/reject/feature/reply |
| DELETE | `/:id` | admin+ | Delete a review |

## Reservations — `/reservations`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Book a table |
| GET | `/` | staff+ | List (`?branch=`, `?status=`, `?date=`) |
| GET | `/:id` | staff+ | Get one |
| PATCH | `/:id` | staff+ | Update status/table number |
| DELETE | `/:id` | manager+ | Delete |

## Contact — `/contact`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit contact form |
| GET | `/` | manager+ | List messages |
| PATCH | `/:id` | manager+ | Update status |
| DELETE | `/:id` | manager+ | Delete |

## Offers / Coupons — `/offers`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Active, non-expired offers |
| GET | `/validate/:code` | Public | Validate a coupon code |
| GET | `/admin/all` | manager+ | All offers |
| POST | `/` | manager+ | Create (multipart: `image`) |
| PATCH | `/:id` | manager+ | Update |
| DELETE | `/:id` | admin+ | Delete |

## FAQs — `/faqs`
Standard public GET / manager+ POST-PATCH / admin+ DELETE, same pattern as Categories.

## Newsletter — `/newsletter`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/subscribe` | Public | Subscribe |
| PATCH | `/unsubscribe/:email` | Public | Unsubscribe |
| GET | `/` | manager+ | List subscribers |

## Careers — `/careers`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Active job listings |
| GET | `/:id` | Public | Get one job (by id or slug) |
| POST | `/:jobId/apply` | Public | Apply (multipart: `resume` PDF/DOC) |
| GET | `/admin/all` | manager+ | All jobs, incl. inactive |
| POST | `/` | manager+ | Create job |
| PATCH | `/:id` | manager+ | Update job |
| DELETE | `/:id` | admin+ | Delete job + its applications |
| GET | `/:jobId/applications` | manager+ | List applicants for a job |
| PATCH | `/applications/:id/status` | manager+ | Update applicant status |

## Site Settings — `/settings`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Homepage/SEO/social/currency config |
| PATCH | `/` | admin+ | Update (multipart: `logo`, `favicon`) |

## Dashboard — `/dashboard`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/summary` | manager+ | All overview counters |
| GET | `/visitor-trend?days=14` | manager+ | Daily visit counts |

## Misc
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |

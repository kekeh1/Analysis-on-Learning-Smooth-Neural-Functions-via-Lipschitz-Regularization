#include "fd_partial_derivative.h"
#include <iostream>

void fd_partial_derivative(
  const int nx,
  const int ny,
  const int nz,
  const double h,
  const int dir,
  Eigen::SparseMatrix<double> & D)
{
  ////////////////////////////////////////////////////////////////////////////

	typedef Eigen::Triplet<double> T;
	std::vector<T> coefficients;

	


	int m = 0;
	int ijk;
	int d;
	// m = (nx-1)*ny*nz  if dir = 0
	// m = nx*(ny-1)*nz  if dir = 1
	// m = nx*ny*(nz-1)  otherwise (if dir = 2)
	if (dir == 0) {
		m = (nx - 1) * ny * nz;
		coefficients.reserve(2 * nx * ny * nz);
		for (int i = 0; i < nx - 1; i++) {
			for (int j = 0; j < ny; j++) {
				for (int k = 0; k < nz; k++) {
					ijk = i + j * (nx - 1)  + k * ny * (nx - 1);
					d = i + j * nx + k * ny * nx;
					coefficients.push_back(T(ijk, d, (-1 / (double) h)));
					coefficients.push_back(T(ijk, d + 1, (1 / (double)h)));

				}
			}
		}
	}
	else if (dir == 1) {
		m = nx* (ny - 1)* nz;
		coefficients.reserve(2 * nx * ny * nz);
		for (int i = 0; i < nx; i++) {
			for (int j = 0; j < (ny - 1); j++) {
				for (int k = 0; k < nz; k++) {
					ijk = i + j * nx + k * (ny - 1) * nx;
					d = i + j * nx + k * ny * nx;
					coefficients.push_back(T(ijk, d, (-1 / (double)h)));
					coefficients.push_back(T(ijk, d + nx, (1 / (double)h)));

				}
			}
		}
	}
	else if (dir == 2) {
		m = nx * ny * (nz - 1);
		coefficients.reserve(2 * nx * ny * nz);
		for (int i = 0; i < nx; i++) {
			for (int j = 0; j < ny; j++) {
				for (int k = 0; k < (nz - 1); k++) {
					ijk = i + j * nx + k * ny * nx;
					d = i + j * nx + k * ny * nx;
					coefficients.push_back(T(ijk, d, (-1 / (double)h)));
					coefficients.push_back(T(ijk, d + ny * nx, (1 / (double)h)));

				}
			}
		}
	}
	else {
		std::cout << "error dir";
	}


	D.resize(m, nx * ny * nz);
	D.setFromTriplets(coefficients.begin(), coefficients.end());




  ////////////////////////////////////////////////////////////////////////////
}

#include "fd_grad.h"
#include "fd_partial_derivative.h"

void fd_grad(
  const int nx,
  const int ny,
  const int nz,
  const double h,
  Eigen::SparseMatrix<double> & G)
{
  ////////////////////////////////////////////////////////////////////////////
  //   G  (nx-1)*ny*nz+ nx*(ny-1)*nz+ nx*ny*(nz-1) by nx*ny*nz sparse gradient
  //     matrix: G = [Dx;Dy;Dz]

	Eigen::SparseMatrix<double> Dx;
	Eigen::SparseMatrix<double> Dy;
	Eigen::SparseMatrix<double> Dz;

	
	fd_partial_derivative(nx, ny, nz, h, 0, Dx);
	fd_partial_derivative(nx, ny, nz, h, 1, Dy);
	fd_partial_derivative(nx, ny, nz, h, 2, Dz);

	
	//https://stackoverflow.com/questions/41756428/concatenate-sparse-matrix-eigen
	G.resize((nx - 1) * ny * nz + nx * (ny - 1) * nz + nx * ny * (nz - 1), nx * ny * nz);
	G.reserve(Dx.nonZeros() + Dy.nonZeros() + Dz.nonZeros());

	for (Eigen::Index c = 0; c < Dx.cols(); ++c)
	{
		G.startVec(c); // Important: Must be called once for each column before inserting!
		for (Eigen::SparseMatrix<double>::InnerIterator itx(Dx, c); itx; ++itx)
			G.insertBack(itx.row(), c) = itx.value();
		for (Eigen::SparseMatrix<double>::InnerIterator ity(Dy, c); ity; ++ity)
			G.insertBack(ity.row() + Dx.rows(), c) = ity.value();
		for (Eigen::SparseMatrix<double>::InnerIterator itz(Dz, c); itz; ++itz)
			G.insertBack(itz.row() + Dx.rows() + Dy.rows(), c) = itz.value();
	}
	G.finalize();

  ////////////////////////////////////////////////////////////////////////////
}
